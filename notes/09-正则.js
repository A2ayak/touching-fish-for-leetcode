// 1、匹配括号内的内容
const regBracketMatch = /(?<=\()(.+?)(?=\))/g; // 分三个括号看
const strBracketMatch = "123{456}hhh[789]zzz[yyy]bbb(90ba)kkk";
// console.log(strBracketMatch.match(regBracketMatch))

// 2、密码强度，必须包含大小写字母、数字和特殊字符，并且不能包含部分字符(数字0、小写o、大写I、小写l)，且长度至少为8
const regValidatePsw =
  /^(?=.*[a-km-np-z])(?=.*[A-HJ-NR-Z])(?=.*[!@#$%^&*+=.<>?])(?!.*[o0Il]).{8,}$/g;
const strValidatePsw = "Test@#123";
// console.log(regValidatePsw.test(strValidatePsw))

// 3、最新版本匹配纯中文
const checkZhReg = /\p{Unified_Ideograph}+/u;
// console.log(checkZhReg.test('asdad'))

// 4、// 匹配 http:// 开头直到第一个 / 的ip所有内容
const url =
  "http://192.168.61.249:5050/3号门车辆-192.168.2.11/11010100101320278046/hls.m3u8";
const hlsUrl = url.replace(
  /^http:\/\/[\d.]+:[\d]+\//, // 匹配 http:// 开头直到第一个 / 的所有内容
  "https://xxxx.vicp.fun/video-play/"
);
// console.log(hlsUrl);
