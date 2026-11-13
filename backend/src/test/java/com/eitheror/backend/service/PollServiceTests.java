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
    PollService service = new PollService(polls, options, mock(MemberRepository.class), votes, comments);
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
    @Test void editingPreservesOptionIdsAndVotes() {
        when(votes.countByPoll_PollId(10L)).thenReturn(3L);
        var result = service.updatePoll(10L, request("A"));
        assertEquals("Updated", result.getTitle());
        assertEquals(20L, result.getOptions().getFirst().getOptionId());
        assertEquals(3L, result.getTotalVotes());
        verify(votes, never()).deleteAllByPollId(any());
    }
    @Test void optionsCanChangeBeforeParticipation() {
        service.updatePoll(10L, request("New A"));
        assertEquals("New A", a.getContent());
        assertEquals(20L, a.getOptionId());
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
    @Test void deletionRemovesDependentsBeforePoll() {
        service.deletePoll(10L);
        var order = inOrder(comments, votes, options, polls);
        order.verify(comments).deleteAllByPollId(10L);
        order.verify(votes).deleteAllByPollId(10L);
        order.verify(options).deleteAllByPollId(10L);
        order.verify(polls).delete(poll);
    }
}
