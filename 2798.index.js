/*! For license information please see 2798.index.js.LICENSE.txt */
"use strict";(self.webpackChunkjson_nets=self.webpackChunkjson_nets||[]).push([[2798],{52798:(e,n,s)=>{s.r(n),s.d(n,{conf:()=>o,language:()=>t});var o={comments:{lineComment:"#"},brackets:[["{","}"],["[","]"],["(",")"]],autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}],surroundingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}]},t={defaultToken:"",tokenPostfix:".ini",escapes:/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,tokenizer:{root:[[/^\[[^\]]*\]/,"metatag"],[/(^\w+)(\s*)(\=)/,["key","","delimiter"]],{include:"@whitespace"},[/\d+/,"number"],[/"([^"\\]|\\.)*$/,"string.invalid"],[/'([^'\\]|\\.)*$/,"string.invalid"],[/"/,"string",'@string."'],[/'/,"string","@string.'"]],whitespace:[[/[ \t\r\n]+/,""],[/^\s*[#;].*$/,"comment"]],string:[[/[^\\"']+/,"string"],[/@escapes/,"string.escape"],[/\\./,"string.escape.invalid"],[/["']/,{cases:{"$#==$S2":{token:"string",next:"@pop"},"@default":"string"}}]]}}}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjc5OC5pbmRleC5qcyIsIm1hcHBpbmdzIjoiO2lKQVFBLElBQUlBLEVBQU8sQ0FDVEMsU0FBVSxDQUNSQyxZQUFhLEtBRWZDLFNBQVUsQ0FDUixDQUFDLElBQUssS0FDTixDQUFDLElBQUssS0FDTixDQUFDLElBQUssTUFFUkMsaUJBQWtCLENBQ2hCLENBQUVDLEtBQU0sSUFBS0MsTUFBTyxLQUNwQixDQUFFRCxLQUFNLElBQUtDLE1BQU8sS0FDcEIsQ0FBRUQsS0FBTSxJQUFLQyxNQUFPLEtBQ3BCLENBQUVELEtBQU0sSUFBS0MsTUFBTyxLQUNwQixDQUFFRCxLQUFNLElBQUtDLE1BQU8sTUFFdEJDLGlCQUFrQixDQUNoQixDQUFFRixLQUFNLElBQUtDLE1BQU8sS0FDcEIsQ0FBRUQsS0FBTSxJQUFLQyxNQUFPLEtBQ3BCLENBQUVELEtBQU0sSUFBS0MsTUFBTyxLQUNwQixDQUFFRCxLQUFNLElBQUtDLE1BQU8sS0FDcEIsQ0FBRUQsS0FBTSxJQUFLQyxNQUFPLE9BR3BCRSxFQUFXLENBQ2JDLGFBQWMsR0FDZEMsYUFBYyxPQUNkQyxRQUFTLHdFQUNUQyxVQUFXLENBQ1RDLEtBQU0sQ0FDSixDQUFDLGNBQWUsV0FDaEIsQ0FBQyxrQkFBbUIsQ0FBQyxNQUFPLEdBQUksY0FDaEMsQ0FBRUMsUUFBUyxlQUNYLENBQUMsTUFBTyxVQUNSLENBQUMsa0JBQW1CLGtCQUNwQixDQUFDLGtCQUFtQixrQkFDcEIsQ0FBQyxJQUFLLFNBQVUsYUFDaEIsQ0FBQyxJQUFLLFNBQVUsY0FFbEJDLFdBQVksQ0FDVixDQUFDLGFBQWMsSUFDZixDQUFDLGNBQWUsWUFFbEJDLE9BQVEsQ0FDTixDQUFDLFdBQVksVUFDYixDQUFDLFdBQVksaUJBQ2IsQ0FBQyxNQUFPLHlCQUNSLENBQ0UsT0FDQSxDQUNFQyxNQUFPLENBQ0wsVUFBVyxDQUFFQyxNQUFPLFNBQVVDLEtBQU0sUUFDcEMsV0FBWSIsInNvdXJjZXMiOlsid2VicGFjazovL2pzb24tbmV0cy8uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvaW5pL2luaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBWZXJzaW9uOiAwLjM0LjEoNTQ3ODcwYjY4ODEzMDJjNWI0ZmYzMjE3M2MxNmQwNjAwOWUzNTg4ZilcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9tb25hY28tZWRpdG9yL2Jsb2IvbWFpbi9MSUNFTlNFLnR4dFxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8vIHNyYy9iYXNpYy1sYW5ndWFnZXMvaW5pL2luaS50c1xudmFyIGNvbmYgPSB7XG4gIGNvbW1lbnRzOiB7XG4gICAgbGluZUNvbW1lbnQ6IFwiI1wiXG4gIH0sXG4gIGJyYWNrZXRzOiBbXG4gICAgW1wie1wiLCBcIn1cIl0sXG4gICAgW1wiW1wiLCBcIl1cIl0sXG4gICAgW1wiKFwiLCBcIilcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfVxuICBdLFxuICBzdXJyb3VuZGluZ1BhaXJzOiBbXG4gICAgeyBvcGVuOiBcIntcIiwgY2xvc2U6IFwifVwiIH0sXG4gICAgeyBvcGVuOiBcIltcIiwgY2xvc2U6IFwiXVwiIH0sXG4gICAgeyBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJyB9LFxuICAgIHsgb3BlbjogXCInXCIsIGNsb3NlOiBcIidcIiB9XG4gIF1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5pbmlcIixcbiAgZXNjYXBlczogL1xcXFwoPzpbYWJmbnJ0dlxcXFxcIiddfHhbMC05QS1GYS1mXXsxLDR9fHVbMC05QS1GYS1mXXs0fXxVWzAtOUEtRmEtZl17OH0pLyxcbiAgdG9rZW5pemVyOiB7XG4gICAgcm9vdDogW1xuICAgICAgWy9eXFxbW15cXF1dKlxcXS8sIFwibWV0YXRhZ1wiXSxcbiAgICAgIFsvKF5cXHcrKShcXHMqKShcXD0pLywgW1wia2V5XCIsIFwiXCIsIFwiZGVsaW1pdGVyXCJdXSxcbiAgICAgIHsgaW5jbHVkZTogXCJAd2hpdGVzcGFjZVwiIH0sXG4gICAgICBbL1xcZCsvLCBcIm51bWJlclwiXSxcbiAgICAgIFsvXCIoW15cIlxcXFxdfFxcXFwuKSokLywgXCJzdHJpbmcuaW52YWxpZFwiXSxcbiAgICAgIFsvJyhbXidcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbL1wiLywgXCJzdHJpbmdcIiwgJ0BzdHJpbmcuXCInXSxcbiAgICAgIFsvJy8sIFwic3RyaW5nXCIsIFwiQHN0cmluZy4nXCJdXG4gICAgXSxcbiAgICB3aGl0ZXNwYWNlOiBbXG4gICAgICBbL1sgXFx0XFxyXFxuXSsvLCBcIlwiXSxcbiAgICAgIFsvXlxccypbIztdLiokLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBzdHJpbmc6IFtcbiAgICAgIFsvW15cXFxcXCInXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcXFwuLywgXCJzdHJpbmcuZXNjYXBlLmludmFsaWRcIl0sXG4gICAgICBbXG4gICAgICAgIC9bXCInXS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCIkIz09JFMyXCI6IHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHBvcFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwic3RyaW5nXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdXG4gIH1cbn07XG5leHBvcnQge1xuICBjb25mLFxuICBsYW5ndWFnZVxufTtcbiJdLCJuYW1lcyI6WyJjb25mIiwiY29tbWVudHMiLCJsaW5lQ29tbWVudCIsImJyYWNrZXRzIiwiYXV0b0Nsb3NpbmdQYWlycyIsIm9wZW4iLCJjbG9zZSIsInN1cnJvdW5kaW5nUGFpcnMiLCJsYW5ndWFnZSIsImRlZmF1bHRUb2tlbiIsInRva2VuUG9zdGZpeCIsImVzY2FwZXMiLCJ0b2tlbml6ZXIiLCJyb290IiwiaW5jbHVkZSIsIndoaXRlc3BhY2UiLCJzdHJpbmciLCJjYXNlcyIsInRva2VuIiwibmV4dCJdLCJzb3VyY2VSb290IjoiIn0=