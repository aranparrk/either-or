import Input from "../common/Input.jsx";
import { Field, Label, Message } from "./signupStyles.js";

export default function NicknameField({ id, field, disabled }) {
  const messageId = id + "-message";

  return (
    <>
      <Label htmlFor={id}>닉네임</Label>
      <Field>
        <Input
          id={id}
          autoComplete="nickname"
          aria-describedby={messageId}
          placeholder="닉네임을 입력해주세요"
          value={field.value}
          maxLength={20}
          required
          disabled={disabled}
          onChange={(event) => field.onChange(event.target.value)}
        />
        <Message
          id={messageId}
          aria-live="polite"
          aria-busy={field.status === "checking"}
          $valid={field.status === "available"}
        >
          {field.message}
        </Message>
      </Field>
    </>
  );
}
