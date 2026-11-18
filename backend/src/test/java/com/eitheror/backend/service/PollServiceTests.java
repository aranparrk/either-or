package com.eitheror.backend.service;

import com.eitheror.backend.dto.PollCreateReqDto;
import com.eitheror.backend.entity.*;
import com.eitheror.backend.repository.*;
import org.junit.jupiter.api.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PollServiceTests {
    PollRepository polls = mock(PollRepository.class);
    PollOptionRepository options = mock(PollOptionRepository.class);
    VoteRepository votes = mock(VoteRepository.class);
    CommentRepository comments = mock(CommentRepository.class);
    MemberRepository members = mock(MemberRepository.class);
    PollService service = new PollService(polls, options, members, votes, comments);
    Poll poll;
    PollOption a, b;

    @BeforeEach void setup() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("1", null, List.of()));
        Member author = new Member();
        author.setMemberId(1L);
        poll = new Poll();
        poll.setPollId(10L);
        poll.setMember(author);
        poll.setTitle("Original");
        poll.setDeadline(LocalDateTime.now().plusDays(1));
        a = new PollOption(); a.setOptionId(20L); a.setContent("A");
        b = new PollOption(); b.setOptionId(21L); b.setContent("B");
        when(polls.findByIdForUpdate(10L)).thenReturn(Optional.of(poll));
        when(options.findByPoll_PollId(10L)).thenReturn(new ArrayList<>(List.of(b, a)));
    }
    @AfterEach void cleanup() { SecurityContextHolder.clearContext(); }

    PollCreateReqDto request(String first) {
        PollCreateReqDto dto = new PollCreateReqDto();
        dto.setTitle("Updated"); dto.setContent("Description");
        dto.setOptions(List.of(first, "B")); dto.setDeadline(poll.getDeadline());
        return dto;
    }
    @Test void nonAuthorCannotUpdateOrDelete() {
        poll.getMember().setMemberId(2L);
        assertEquals(403, assertThrows(ResponseStatusException.class,
                () -> service.updatePoll(10L, request("A"))).getStatusCode().value());
        assertEquals(403, assertThrows(ResponseStatusException.class,
                () -> service.deletePoll(10L)).getStatusCode().value());
        verifyNoInteractions(comments, votes, options);
        verify(polls, never()).delete(any());
    }
    @Test void missingPollReturns404() {
        when(polls.findByIdForUpdate(10L)).thenReturn(Optional.empty());
        assertEquals(404, assertThrows(ResponseStatusException.class,
                () -> service.deletePoll(10L)).getStatusCode().value());
    }
    @Test void existingVotesPreventOptionChanges() {
        when(votes.countByPoll_PollId(10L)).thenReturn(1L);
        assertEquals(409, assertThrows(ResponseStatusException.class,
                () -> service.updatePoll(10L, request("New A"))).getStatusCode().value());
        assertEquals("Original", poll.getTitle());
        assertEquals("A", a.getContent());
    }
    @Test void existingVotesAllowOnlyDeadlineChanges() {
        when(votes.countByPoll_PollId(10L)).thenReturn(3L);
        var dto = request("A");
        dto.setTitle(poll.getTitle());
        dto.setContent("Changed");
        assertEquals(409, assertThrows(ResponseStatusException.class,
                () -> service.updatePoll(10L, dto)).getStatusCode().value());
        dto.setContent(poll.getContent());
        dto.setContentImage("https://example.com/new.jpg");
        assertEquals(409, assertThrows(ResponseStatusException.class,
                () -> service.updatePoll(10L, dto)).getStatusCode().value());
        dto.setContentImage(null);
        dto.setTitle("Changed title");
        assertEquals(409, assertThrows(ResponseStatusException.class,
                () -> service.updatePoll(10L, dto)).getStatusCode().value());

        dto.setTitle(poll.getTitle());
        dto.setDeadline(poll.getDeadline().plusDays(1));
        var result = service.updatePoll(10L, dto);
        assertEquals(dto.getDeadline(), result.getDeadline());
        assertEquals("Original", result.getTitle());
        assertEquals(20L, result.getOptions().getFirst().getOptionId());
        assertEquals(3L, result.getTotalVotes());
        verify(votes, never()).deleteAllByPollId(any());
    }
    @Test void optionsCanChangeBeforeParticipation() {
        service.updatePoll(10L, request("New A"));
        assertEquals("New A", a.getContent());
        assertEquals(20L, a.getOptionId());
    }
    @Test void tourImageFollowsTheSelectedOptionAndSurvivesTextOnlyUpdates() {
        String imageUrl = "https://tong.visitkorea.or.kr/cms/resource/47/4105447_image2_1.jpg";
        var dto = request("해운대해수욕장");
        dto.setTourOptions(Arrays.asList(new PollCreateReqDto.TourOption("126081", imageUrl), null));

        var updated = service.updatePoll(10L, dto);
        assertEquals("126081", updated.getOptions().getFirst().getContentId());
        assertEquals(imageUrl, updated.getOptions().getFirst().getImageUrl());
        assertNull(updated.getOptions().getLast().getImageUrl());

        var legacyUpdate = service.updatePoll(10L, request("해운대해수욕장"));
        assertEquals(imageUrl, legacyUpdate.getOptions().getFirst().getImageUrl());

        service.updatePoll(10L, request("Different option"));
        assertNull(a.getTourContentId());
        assertNull(a.getTourImageUrl());
    }
    @Test void closedPollCanKeepDeadlineButCannotSetAnotherPastDeadline() {
        poll.setDeadline(LocalDateTime.now().minusDays(1));
        service.updatePoll(10L, request("A"));
        var dto = request("A"); dto.setDeadline(LocalDateTime.now().minusDays(2));
        assertEquals(400, assertThrows(ResponseStatusException.class,
                () -> service.updatePoll(10L, dto)).getStatusCode().value());
    }
    @Test void invalidRequestIsRejected() {
        var dto = request("A"); dto.setOptions(List.of("A"));
        assertEquals(400, assertThrows(ResponseStatusException.class,
                () -> service.updatePoll(10L, dto)).getStatusCode().value());
    }
    @Test void pollContentIsOptionalOnCreateAndUpdate() {
        when(members.findById(1L)).thenReturn(Optional.of(poll.getMember()));
        when(polls.save(any(Poll.class))).thenAnswer(call -> call.getArgument(0));
        when(options.save(any(PollOption.class))).thenAnswer(call -> call.getArgument(0));
        var create = request("A");
        create.setContent(null);
        assertEquals("", service.createPoll(create).getContent());

        var update = request("A");
        update.setContent("   ");
        assertEquals("", service.updatePoll(10L, update).getContent());
    }
    @Test void deletionRemovesDependentsBeforePoll() {
        service.deletePoll(10L);
        var order = inOrder(comments, votes, options, polls);
        order.verify(comments).deleteAllByPollId(10L);
        order.verify(votes).deleteAllByPollId(10L);
        order.verify(options).deleteAllByPollId(10L);
        order.verify(polls).delete(poll);
    }
}
