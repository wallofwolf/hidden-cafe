// 이메일 정규식 : (모든 숫자 + 모든 알파벳)@(모든 알파벳).(2~3개 이내의 모든 알파벳)
export const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
// 비밀번호 정규식 : 숫자, 알파벳, 특수문자를 모두 포함해 10글자 이상
export const pwRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{10,}$/;
