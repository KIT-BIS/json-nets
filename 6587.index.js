/*! For license information please see 6587.index.js.LICENSE.txt */
"use strict";(self.webpackChunkjson_nets=self.webpackChunkjson_nets||[]).push([[6587],{86587:(e,n,o)=>{o.r(n),o.d(n,{conf:()=>t,language:()=>r});var t={comments:{lineComment:"//",blockComment:["(*","*)"]},brackets:[["{","}"],["[","]"],["(",")"],["var","end_var"],["var_input","end_var"],["var_output","end_var"],["var_in_out","end_var"],["var_temp","end_var"],["var_global","end_var"],["var_access","end_var"],["var_external","end_var"],["type","end_type"],["struct","end_struct"],["program","end_program"],["function","end_function"],["function_block","end_function_block"],["action","end_action"],["step","end_step"],["initial_step","end_step"],["transaction","end_transaction"],["configuration","end_configuration"],["tcp","end_tcp"],["recource","end_recource"],["channel","end_channel"],["library","end_library"],["folder","end_folder"],["binaries","end_binaries"],["includes","end_includes"],["sources","end_sources"]],autoClosingPairs:[{open:"[",close:"]"},{open:"{",close:"}"},{open:"(",close:")"},{open:"/*",close:"*/"},{open:"'",close:"'",notIn:["string_sq"]},{open:'"',close:'"',notIn:["string_dq"]},{open:"var_input",close:"end_var"},{open:"var_output",close:"end_var"},{open:"var_in_out",close:"end_var"},{open:"var_temp",close:"end_var"},{open:"var_global",close:"end_var"},{open:"var_access",close:"end_var"},{open:"var_external",close:"end_var"},{open:"type",close:"end_type"},{open:"struct",close:"end_struct"},{open:"program",close:"end_program"},{open:"function",close:"end_function"},{open:"function_block",close:"end_function_block"},{open:"action",close:"end_action"},{open:"step",close:"end_step"},{open:"initial_step",close:"end_step"},{open:"transaction",close:"end_transaction"},{open:"configuration",close:"end_configuration"},{open:"tcp",close:"end_tcp"},{open:"recource",close:"end_recource"},{open:"channel",close:"end_channel"},{open:"library",close:"end_library"},{open:"folder",close:"end_folder"},{open:"binaries",close:"end_binaries"},{open:"includes",close:"end_includes"},{open:"sources",close:"end_sources"}],surroundingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"},{open:"var",close:"end_var"},{open:"var_input",close:"end_var"},{open:"var_output",close:"end_var"},{open:"var_in_out",close:"end_var"},{open:"var_temp",close:"end_var"},{open:"var_global",close:"end_var"},{open:"var_access",close:"end_var"},{open:"var_external",close:"end_var"},{open:"type",close:"end_type"},{open:"struct",close:"end_struct"},{open:"program",close:"end_program"},{open:"function",close:"end_function"},{open:"function_block",close:"end_function_block"},{open:"action",close:"end_action"},{open:"step",close:"end_step"},{open:"initial_step",close:"end_step"},{open:"transaction",close:"end_transaction"},{open:"configuration",close:"end_configuration"},{open:"tcp",close:"end_tcp"},{open:"recource",close:"end_recource"},{open:"channel",close:"end_channel"},{open:"library",close:"end_library"},{open:"folder",close:"end_folder"},{open:"binaries",close:"end_binaries"},{open:"includes",close:"end_includes"},{open:"sources",close:"end_sources"}],folding:{markers:{start:new RegExp("^\\s*#pragma\\s+region\\b"),end:new RegExp("^\\s*#pragma\\s+endregion\\b")}}},r={defaultToken:"",tokenPostfix:".st",ignoreCase:!0,brackets:[{token:"delimiter.curly",open:"{",close:"}"},{token:"delimiter.parenthesis",open:"(",close:")"},{token:"delimiter.square",open:"[",close:"]"}],keywords:["if","end_if","elsif","else","case","of","to","__try","__catch","__finally","do","with","by","while","repeat","end_while","end_repeat","end_case","for","end_for","task","retain","non_retain","constant","with","at","exit","return","interval","priority","address","port","on_channel","then","iec","file","uses","version","packagetype","displayname","copyright","summary","vendor","common_source","from","extends"],constant:["false","true","null"],defineKeywords:["var","var_input","var_output","var_in_out","var_temp","var_global","var_access","var_external","end_var","type","end_type","struct","end_struct","program","end_program","function","end_function","function_block","end_function_block","interface","end_interface","method","end_method","property","end_property","namespace","end_namespace","configuration","end_configuration","tcp","end_tcp","resource","end_resource","channel","end_channel","library","end_library","folder","end_folder","binaries","end_binaries","includes","end_includes","sources","end_sources","action","end_action","step","initial_step","end_step","transaction","end_transaction"],typeKeywords:["int","sint","dint","lint","usint","uint","udint","ulint","real","lreal","time","date","time_of_day","date_and_time","string","bool","byte","word","dword","array","pointer","lword"],operators:["=",">","<",":",":=","<=",">=","<>","&","+","-","*","**","MOD","^","or","and","not","xor","abs","acos","asin","atan","cos","exp","expt","ln","log","sin","sqrt","tan","sel","max","min","limit","mux","shl","shr","rol","ror","indexof","sizeof","adr","adrinst","bitadr","is_valid","ref","ref_to"],builtinVariables:[],builtinFunctions:["sr","rs","tp","ton","tof","eq","ge","le","lt","ne","round","trunc","ctd","сtu","ctud","r_trig","f_trig","move","concat","delete","find","insert","left","len","replace","right","rtc"],symbols:/[=><!~?:&|+\-*\/\^%]+/,escapes:/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,tokenizer:{root:[[/(\.\.)/,"delimiter"],[/\b(16#[0-9A-Fa-f\_]*)+\b/,"number.hex"],[/\b(2#[01\_]+)+\b/,"number.binary"],[/\b(8#[0-9\_]*)+\b/,"number.octal"],[/\b\d*\.\d+([eE][\-+]?\d+)?\b/,"number.float"],[/\b(L?REAL)#[0-9\_\.e]+\b/,"number.float"],[/\b(BYTE|(?:D|L)?WORD|U?(?:S|D|L)?INT)#[0-9\_]+\b/,"number"],[/\d+/,"number"],[/\b(T|DT|TOD)#[0-9:-_shmyd]+\b/,"tag"],[/\%(I|Q|M)(X|B|W|D|L)[0-9\.]+/,"tag"],[/\%(I|Q|M)[0-9\.]*/,"tag"],[/\b[A-Za-z]{1,6}#[0-9]+\b/,"tag"],[/\b(TO_|CTU_|CTD_|CTUD_|MUX_|SEL_)[A_Za-z]+\b/,"predefined"],[/\b[A_Za-z]+(_TO_)[A_Za-z]+\b/,"predefined"],[/[;]/,"delimiter"],[/[.]/,{token:"delimiter",next:"@params"}],[/[a-zA-Z_]\w*/,{cases:{"@operators":"operators","@keywords":"keyword","@typeKeywords":"type","@defineKeywords":"variable","@constant":"constant","@builtinVariables":"predefined","@builtinFunctions":"predefined","@default":"identifier"}}],{include:"@whitespace"},[/[{}()\[\]]/,"@brackets"],[/"([^"\\]|\\.)*$/,"string.invalid"],[/"/,{token:"string.quote",bracket:"@open",next:"@string_dq"}],[/'/,{token:"string.quote",bracket:"@open",next:"@string_sq"}],[/'[^\\']'/,"string"],[/(')(@escapes)(')/,["string","string.escape","string"]],[/'/,"string.invalid"]],params:[[/\b[A-Za-z0-9_]+\b(?=\()/,{token:"identifier",next:"@pop"}],[/\b[A-Za-z0-9_]+\b/,"variable.name","@pop"]],comment:[[/[^\/*]+/,"comment"],[/\/\*/,"comment","@push"],["\\*/","comment","@pop"],[/[\/*]/,"comment"]],comment2:[[/[^\(*]+/,"comment"],[/\(\*/,"comment","@push"],["\\*\\)","comment","@pop"],[/[\(*]/,"comment"]],whitespace:[[/[ \t\r\n]+/,"white"],[/\/\/.*$/,"comment"],[/\/\*/,"comment","@comment"],[/\(\*/,"comment","@comment2"]],string_dq:[[/[^\\"]+/,"string"],[/@escapes/,"string.escape"],[/\\./,"string.escape.invalid"],[/"/,{token:"string.quote",bracket:"@close",next:"@pop"}]],string_sq:[[/[^\\']+/,"string"],[/@escapes/,"string.escape"],[/\\./,"string.escape.invalid"],[/'/,{token:"string.quote",bracket:"@close",next:"@pop"}]]}}}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFTLENBQ1AsQ0FBQyxVQUFXLFdBQ1osQ0FBQyxPQUFRLFVBQVcsU0FDcEIsQ0FBQyxPQUFRLFVBQVcsUUFDcEIsQ0FBQyxRQUFTLFlBRVpDLFNBQVUsQ0FDUixDQUFDLFVBQVcsV0FDWixDQUFDLE9BQVEsVUFBVyxTQUNwQixDQUFDLFNBQVUsVUFBVyxRQUN0QixDQUFDLFFBQVMsWUFFWkMsV0FBWSxDQUNWLENBQUMsYUFBYyxTQUNmLENBQUMsVUFBVyxXQUNaLENBQUMsT0FBUSxVQUFXLFlBQ3BCLENBQUMsT0FBUSxVQUFXLGNBRXRCQyxVQUFXLENBQ1QsQ0FBQyxVQUFXLFVBQ1osQ0FBQyxXQUFZLGlCQUNiLENBQUMsTUFBTyx5QkFDUixDQUFDLElBQUssQ0FBRXBCLE1BQU8sZUFBZ0JlLFFBQVMsU0FBVUgsS0FBTSxVQUUxRFMsVUFBVyxDQUNULENBQUMsVUFBVyxVQUNaLENBQUMsV0FBWSxpQkFDYixDQUFDLE1BQU8seUJBQ1IsQ0FBQyxJQUFLLENBQUVyQixNQUFPLGVBQWdCZSxRQUFTLFNBQVVILEtBQU0iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc29uLW5ldHMvLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL3N0L3N0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFZlcnNpb246IDAuMzQuMSg1NDc4NzBiNjg4MTMwMmM1YjRmZjMyMTczYzE2ZDA2MDA5ZTM1ODhmKVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L21vbmFjby1lZGl0b3IvYmxvYi9tYWluL0xJQ0VOU0UudHh0XG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLy8gc3JjL2Jhc2ljLWxhbmd1YWdlcy9zdC9zdC50c1xudmFyIGNvbmYgPSB7XG4gIGNvbW1lbnRzOiB7XG4gICAgbGluZUNvbW1lbnQ6IFwiLy9cIixcbiAgICBibG9ja0NvbW1lbnQ6IFtcIigqXCIsIFwiKilcIl1cbiAgfSxcbiAgYnJhY2tldHM6IFtcbiAgICBbXCJ7XCIsIFwifVwiXSxcbiAgICBbXCJbXCIsIFwiXVwiXSxcbiAgICBbXCIoXCIsIFwiKVwiXSxcbiAgICBbXCJ2YXJcIiwgXCJlbmRfdmFyXCJdLFxuICAgIFtcInZhcl9pbnB1dFwiLCBcImVuZF92YXJcIl0sXG4gICAgW1widmFyX291dHB1dFwiLCBcImVuZF92YXJcIl0sXG4gICAgW1widmFyX2luX291dFwiLCBcImVuZF92YXJcIl0sXG4gICAgW1widmFyX3RlbXBcIiwgXCJlbmRfdmFyXCJdLFxuICAgIFtcInZhcl9nbG9iYWxcIiwgXCJlbmRfdmFyXCJdLFxuICAgIFtcInZhcl9hY2Nlc3NcIiwgXCJlbmRfdmFyXCJdLFxuICAgIFtcInZhcl9leHRlcm5hbFwiLCBcImVuZF92YXJcIl0sXG4gICAgW1widHlwZVwiLCBcImVuZF90eXBlXCJdLFxuICAgIFtcInN0cnVjdFwiLCBcImVuZF9zdHJ1Y3RcIl0sXG4gICAgW1wicHJvZ3JhbVwiLCBcImVuZF9wcm9ncmFtXCJdLFxuICAgIFtcImZ1bmN0aW9uXCIsIFwiZW5kX2Z1bmN0aW9uXCJdLFxuICAgIFtcImZ1bmN0aW9uX2Jsb2NrXCIsIFwiZW5kX2Z1bmN0aW9uX2Jsb2NrXCJdLFxuICAgIFtcImFjdGlvblwiLCBcImVuZF9hY3Rpb25cIl0sXG4gICAgW1wic3RlcFwiLCBcImVuZF9zdGVwXCJdLFxuICAgIFtcImluaXRpYWxfc3RlcFwiLCBcImVuZF9zdGVwXCJdLFxuICAgIFtcInRyYW5zYWN0aW9uXCIsIFwiZW5kX3RyYW5zYWN0aW9uXCJdLFxuICAgIFtcImNvbmZpZ3VyYXRpb25cIiwgXCJlbmRfY29uZmlndXJhdGlvblwiXSxcbiAgICBbXCJ0Y3BcIiwgXCJlbmRfdGNwXCJdLFxuICAgIFtcInJlY291cmNlXCIsIFwiZW5kX3JlY291cmNlXCJdLFxuICAgIFtcImNoYW5uZWxcIiwgXCJlbmRfY2hhbm5lbFwiXSxcbiAgICBbXCJsaWJyYXJ5XCIsIFwiZW5kX2xpYnJhcnlcIl0sXG4gICAgW1wiZm9sZGVyXCIsIFwiZW5kX2ZvbGRlclwiXSxcbiAgICBbXCJiaW5hcmllc1wiLCBcImVuZF9iaW5hcmllc1wiXSxcbiAgICBbXCJpbmNsdWRlc1wiLCBcImVuZF9pbmNsdWRlc1wiXSxcbiAgICBbXCJzb3VyY2VzXCIsIFwiZW5kX3NvdXJjZXNcIl1cbiAgXSxcbiAgYXV0b0Nsb3NpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogXCIvKlwiLCBjbG9zZTogXCIqL1wiIH0sXG4gICAgeyBvcGVuOiBcIidcIiwgY2xvc2U6IFwiJ1wiLCBub3RJbjogW1wic3RyaW5nX3NxXCJdIH0sXG4gICAgeyBvcGVuOiAnXCInLCBjbG9zZTogJ1wiJywgbm90SW46IFtcInN0cmluZ19kcVwiXSB9LFxuICAgIHsgb3BlbjogXCJ2YXJfaW5wdXRcIiwgY2xvc2U6IFwiZW5kX3ZhclwiIH0sXG4gICAgeyBvcGVuOiBcInZhcl9vdXRwdXRcIiwgY2xvc2U6IFwiZW5kX3ZhclwiIH0sXG4gICAgeyBvcGVuOiBcInZhcl9pbl9vdXRcIiwgY2xvc2U6IFwiZW5kX3ZhclwiIH0sXG4gICAgeyBvcGVuOiBcInZhcl90ZW1wXCIsIGNsb3NlOiBcImVuZF92YXJcIiB9LFxuICAgIHsgb3BlbjogXCJ2YXJfZ2xvYmFsXCIsIGNsb3NlOiBcImVuZF92YXJcIiB9LFxuICAgIHsgb3BlbjogXCJ2YXJfYWNjZXNzXCIsIGNsb3NlOiBcImVuZF92YXJcIiB9LFxuICAgIHsgb3BlbjogXCJ2YXJfZXh0ZXJuYWxcIiwgY2xvc2U6IFwiZW5kX3ZhclwiIH0sXG4gICAgeyBvcGVuOiBcInR5cGVcIiwgY2xvc2U6IFwiZW5kX3R5cGVcIiB9LFxuICAgIHsgb3BlbjogXCJzdHJ1Y3RcIiwgY2xvc2U6IFwiZW5kX3N0cnVjdFwiIH0sXG4gICAgeyBvcGVuOiBcInByb2dyYW1cIiwgY2xvc2U6IFwiZW5kX3Byb2dyYW1cIiB9LFxuICAgIHsgb3BlbjogXCJmdW5jdGlvblwiLCBjbG9zZTogXCJlbmRfZnVuY3Rpb25cIiB9LFxuICAgIHsgb3BlbjogXCJmdW5jdGlvbl9ibG9ja1wiLCBjbG9zZTogXCJlbmRfZnVuY3Rpb25fYmxvY2tcIiB9LFxuICAgIHsgb3BlbjogXCJhY3Rpb25cIiwgY2xvc2U6IFwiZW5kX2FjdGlvblwiIH0sXG4gICAgeyBvcGVuOiBcInN0ZXBcIiwgY2xvc2U6IFwiZW5kX3N0ZXBcIiB9LFxuICAgIHsgb3BlbjogXCJpbml0aWFsX3N0ZXBcIiwgY2xvc2U6IFwiZW5kX3N0ZXBcIiB9LFxuICAgIHsgb3BlbjogXCJ0cmFuc2FjdGlvblwiLCBjbG9zZTogXCJlbmRfdHJhbnNhY3Rpb25cIiB9LFxuICAgIHsgb3BlbjogXCJjb25maWd1cmF0aW9uXCIsIGNsb3NlOiBcImVuZF9jb25maWd1cmF0aW9uXCIgfSxcbiAgICB7IG9wZW46IFwidGNwXCIsIGNsb3NlOiBcImVuZF90Y3BcIiB9LFxuICAgIHsgb3BlbjogXCJyZWNvdXJjZVwiLCBjbG9zZTogXCJlbmRfcmVjb3VyY2VcIiB9LFxuICAgIHsgb3BlbjogXCJjaGFubmVsXCIsIGNsb3NlOiBcImVuZF9jaGFubmVsXCIgfSxcbiAgICB7IG9wZW46IFwibGlicmFyeVwiLCBjbG9zZTogXCJlbmRfbGlicmFyeVwiIH0sXG4gICAgeyBvcGVuOiBcImZvbGRlclwiLCBjbG9zZTogXCJlbmRfZm9sZGVyXCIgfSxcbiAgICB7IG9wZW46IFwiYmluYXJpZXNcIiwgY2xvc2U6IFwiZW5kX2JpbmFyaWVzXCIgfSxcbiAgICB7IG9wZW46IFwiaW5jbHVkZXNcIiwgY2xvc2U6IFwiZW5kX2luY2x1ZGVzXCIgfSxcbiAgICB7IG9wZW46IFwic291cmNlc1wiLCBjbG9zZTogXCJlbmRfc291cmNlc1wiIH1cbiAgXSxcbiAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgIHsgb3BlbjogXCJ7XCIsIGNsb3NlOiBcIn1cIiB9LFxuICAgIHsgb3BlbjogXCJbXCIsIGNsb3NlOiBcIl1cIiB9LFxuICAgIHsgb3BlbjogXCIoXCIsIGNsb3NlOiBcIilcIiB9LFxuICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicgfSxcbiAgICB7IG9wZW46IFwiJ1wiLCBjbG9zZTogXCInXCIgfSxcbiAgICB7IG9wZW46IFwidmFyXCIsIGNsb3NlOiBcImVuZF92YXJcIiB9LFxuICAgIHsgb3BlbjogXCJ2YXJfaW5wdXRcIiwgY2xvc2U6IFwiZW5kX3ZhclwiIH0sXG4gICAgeyBvcGVuOiBcInZhcl9vdXRwdXRcIiwgY2xvc2U6IFwiZW5kX3ZhclwiIH0sXG4gICAgeyBvcGVuOiBcInZhcl9pbl9vdXRcIiwgY2xvc2U6IFwiZW5kX3ZhclwiIH0sXG4gICAgeyBvcGVuOiBcInZhcl90ZW1wXCIsIGNsb3NlOiBcImVuZF92YXJcIiB9LFxuICAgIHsgb3BlbjogXCJ2YXJfZ2xvYmFsXCIsIGNsb3NlOiBcImVuZF92YXJcIiB9LFxuICAgIHsgb3BlbjogXCJ2YXJfYWNjZXNzXCIsIGNsb3NlOiBcImVuZF92YXJcIiB9LFxuICAgIHsgb3BlbjogXCJ2YXJfZXh0ZXJuYWxcIiwgY2xvc2U6IFwiZW5kX3ZhclwiIH0sXG4gICAgeyBvcGVuOiBcInR5cGVcIiwgY2xvc2U6IFwiZW5kX3R5cGVcIiB9LFxuICAgIHsgb3BlbjogXCJzdHJ1Y3RcIiwgY2xvc2U6IFwiZW5kX3N0cnVjdFwiIH0sXG4gICAgeyBvcGVuOiBcInByb2dyYW1cIiwgY2xvc2U6IFwiZW5kX3Byb2dyYW1cIiB9LFxuICAgIHsgb3BlbjogXCJmdW5jdGlvblwiLCBjbG9zZTogXCJlbmRfZnVuY3Rpb25cIiB9LFxuICAgIHsgb3BlbjogXCJmdW5jdGlvbl9ibG9ja1wiLCBjbG9zZTogXCJlbmRfZnVuY3Rpb25fYmxvY2tcIiB9LFxuICAgIHsgb3BlbjogXCJhY3Rpb25cIiwgY2xvc2U6IFwiZW5kX2FjdGlvblwiIH0sXG4gICAgeyBvcGVuOiBcInN0ZXBcIiwgY2xvc2U6IFwiZW5kX3N0ZXBcIiB9LFxuICAgIHsgb3BlbjogXCJpbml0aWFsX3N0ZXBcIiwgY2xvc2U6IFwiZW5kX3N0ZXBcIiB9LFxuICAgIHsgb3BlbjogXCJ0cmFuc2FjdGlvblwiLCBjbG9zZTogXCJlbmRfdHJhbnNhY3Rpb25cIiB9LFxuICAgIHsgb3BlbjogXCJjb25maWd1cmF0aW9uXCIsIGNsb3NlOiBcImVuZF9jb25maWd1cmF0aW9uXCIgfSxcbiAgICB7IG9wZW46IFwidGNwXCIsIGNsb3NlOiBcImVuZF90Y3BcIiB9LFxuICAgIHsgb3BlbjogXCJyZWNvdXJjZVwiLCBjbG9zZTogXCJlbmRfcmVjb3VyY2VcIiB9LFxuICAgIHsgb3BlbjogXCJjaGFubmVsXCIsIGNsb3NlOiBcImVuZF9jaGFubmVsXCIgfSxcbiAgICB7IG9wZW46IFwibGlicmFyeVwiLCBjbG9zZTogXCJlbmRfbGlicmFyeVwiIH0sXG4gICAgeyBvcGVuOiBcImZvbGRlclwiLCBjbG9zZTogXCJlbmRfZm9sZGVyXCIgfSxcbiAgICB7IG9wZW46IFwiYmluYXJpZXNcIiwgY2xvc2U6IFwiZW5kX2JpbmFyaWVzXCIgfSxcbiAgICB7IG9wZW46IFwiaW5jbHVkZXNcIiwgY2xvc2U6IFwiZW5kX2luY2x1ZGVzXCIgfSxcbiAgICB7IG9wZW46IFwic291cmNlc1wiLCBjbG9zZTogXCJlbmRfc291cmNlc1wiIH1cbiAgXSxcbiAgZm9sZGluZzoge1xuICAgIG1hcmtlcnM6IHtcbiAgICAgIHN0YXJ0OiBuZXcgUmVnRXhwKFwiXlxcXFxzKiNwcmFnbWFcXFxccytyZWdpb25cXFxcYlwiKSxcbiAgICAgIGVuZDogbmV3IFJlZ0V4cChcIl5cXFxccyojcHJhZ21hXFxcXHMrZW5kcmVnaW9uXFxcXGJcIilcbiAgICB9XG4gIH1cbn07XG52YXIgbGFuZ3VhZ2UgPSB7XG4gIGRlZmF1bHRUb2tlbjogXCJcIixcbiAgdG9rZW5Qb3N0Zml4OiBcIi5zdFwiLFxuICBpZ25vcmVDYXNlOiB0cnVlLFxuICBicmFja2V0czogW1xuICAgIHsgdG9rZW46IFwiZGVsaW1pdGVyLmN1cmx5XCIsIG9wZW46IFwie1wiLCBjbG9zZTogXCJ9XCIgfSxcbiAgICB7IHRva2VuOiBcImRlbGltaXRlci5wYXJlbnRoZXNpc1wiLCBvcGVuOiBcIihcIiwgY2xvc2U6IFwiKVwiIH0sXG4gICAgeyB0b2tlbjogXCJkZWxpbWl0ZXIuc3F1YXJlXCIsIG9wZW46IFwiW1wiLCBjbG9zZTogXCJdXCIgfVxuICBdLFxuICBrZXl3b3JkczogW1xuICAgIFwiaWZcIixcbiAgICBcImVuZF9pZlwiLFxuICAgIFwiZWxzaWZcIixcbiAgICBcImVsc2VcIixcbiAgICBcImNhc2VcIixcbiAgICBcIm9mXCIsXG4gICAgXCJ0b1wiLFxuICAgIFwiX190cnlcIixcbiAgICBcIl9fY2F0Y2hcIixcbiAgICBcIl9fZmluYWxseVwiLFxuICAgIFwiZG9cIixcbiAgICBcIndpdGhcIixcbiAgICBcImJ5XCIsXG4gICAgXCJ3aGlsZVwiLFxuICAgIFwicmVwZWF0XCIsXG4gICAgXCJlbmRfd2hpbGVcIixcbiAgICBcImVuZF9yZXBlYXRcIixcbiAgICBcImVuZF9jYXNlXCIsXG4gICAgXCJmb3JcIixcbiAgICBcImVuZF9mb3JcIixcbiAgICBcInRhc2tcIixcbiAgICBcInJldGFpblwiLFxuICAgIFwibm9uX3JldGFpblwiLFxuICAgIFwiY29uc3RhbnRcIixcbiAgICBcIndpdGhcIixcbiAgICBcImF0XCIsXG4gICAgXCJleGl0XCIsXG4gICAgXCJyZXR1cm5cIixcbiAgICBcImludGVydmFsXCIsXG4gICAgXCJwcmlvcml0eVwiLFxuICAgIFwiYWRkcmVzc1wiLFxuICAgIFwicG9ydFwiLFxuICAgIFwib25fY2hhbm5lbFwiLFxuICAgIFwidGhlblwiLFxuICAgIFwiaWVjXCIsXG4gICAgXCJmaWxlXCIsXG4gICAgXCJ1c2VzXCIsXG4gICAgXCJ2ZXJzaW9uXCIsXG4gICAgXCJwYWNrYWdldHlwZVwiLFxuICAgIFwiZGlzcGxheW5hbWVcIixcbiAgICBcImNvcHlyaWdodFwiLFxuICAgIFwic3VtbWFyeVwiLFxuICAgIFwidmVuZG9yXCIsXG4gICAgXCJjb21tb25fc291cmNlXCIsXG4gICAgXCJmcm9tXCIsXG4gICAgXCJleHRlbmRzXCJcbiAgXSxcbiAgY29uc3RhbnQ6IFtcImZhbHNlXCIsIFwidHJ1ZVwiLCBcIm51bGxcIl0sXG4gIGRlZmluZUtleXdvcmRzOiBbXG4gICAgXCJ2YXJcIixcbiAgICBcInZhcl9pbnB1dFwiLFxuICAgIFwidmFyX291dHB1dFwiLFxuICAgIFwidmFyX2luX291dFwiLFxuICAgIFwidmFyX3RlbXBcIixcbiAgICBcInZhcl9nbG9iYWxcIixcbiAgICBcInZhcl9hY2Nlc3NcIixcbiAgICBcInZhcl9leHRlcm5hbFwiLFxuICAgIFwiZW5kX3ZhclwiLFxuICAgIFwidHlwZVwiLFxuICAgIFwiZW5kX3R5cGVcIixcbiAgICBcInN0cnVjdFwiLFxuICAgIFwiZW5kX3N0cnVjdFwiLFxuICAgIFwicHJvZ3JhbVwiLFxuICAgIFwiZW5kX3Byb2dyYW1cIixcbiAgICBcImZ1bmN0aW9uXCIsXG4gICAgXCJlbmRfZnVuY3Rpb25cIixcbiAgICBcImZ1bmN0aW9uX2Jsb2NrXCIsXG4gICAgXCJlbmRfZnVuY3Rpb25fYmxvY2tcIixcbiAgICBcImludGVyZmFjZVwiLFxuICAgIFwiZW5kX2ludGVyZmFjZVwiLFxuICAgIFwibWV0aG9kXCIsXG4gICAgXCJlbmRfbWV0aG9kXCIsXG4gICAgXCJwcm9wZXJ0eVwiLFxuICAgIFwiZW5kX3Byb3BlcnR5XCIsXG4gICAgXCJuYW1lc3BhY2VcIixcbiAgICBcImVuZF9uYW1lc3BhY2VcIixcbiAgICBcImNvbmZpZ3VyYXRpb25cIixcbiAgICBcImVuZF9jb25maWd1cmF0aW9uXCIsXG4gICAgXCJ0Y3BcIixcbiAgICBcImVuZF90Y3BcIixcbiAgICBcInJlc291cmNlXCIsXG4gICAgXCJlbmRfcmVzb3VyY2VcIixcbiAgICBcImNoYW5uZWxcIixcbiAgICBcImVuZF9jaGFubmVsXCIsXG4gICAgXCJsaWJyYXJ5XCIsXG4gICAgXCJlbmRfbGlicmFyeVwiLFxuICAgIFwiZm9sZGVyXCIsXG4gICAgXCJlbmRfZm9sZGVyXCIsXG4gICAgXCJiaW5hcmllc1wiLFxuICAgIFwiZW5kX2JpbmFyaWVzXCIsXG4gICAgXCJpbmNsdWRlc1wiLFxuICAgIFwiZW5kX2luY2x1ZGVzXCIsXG4gICAgXCJzb3VyY2VzXCIsXG4gICAgXCJlbmRfc291cmNlc1wiLFxuICAgIFwiYWN0aW9uXCIsXG4gICAgXCJlbmRfYWN0aW9uXCIsXG4gICAgXCJzdGVwXCIsXG4gICAgXCJpbml0aWFsX3N0ZXBcIixcbiAgICBcImVuZF9zdGVwXCIsXG4gICAgXCJ0cmFuc2FjdGlvblwiLFxuICAgIFwiZW5kX3RyYW5zYWN0aW9uXCJcbiAgXSxcbiAgdHlwZUtleXdvcmRzOiBbXG4gICAgXCJpbnRcIixcbiAgICBcInNpbnRcIixcbiAgICBcImRpbnRcIixcbiAgICBcImxpbnRcIixcbiAgICBcInVzaW50XCIsXG4gICAgXCJ1aW50XCIsXG4gICAgXCJ1ZGludFwiLFxuICAgIFwidWxpbnRcIixcbiAgICBcInJlYWxcIixcbiAgICBcImxyZWFsXCIsXG4gICAgXCJ0aW1lXCIsXG4gICAgXCJkYXRlXCIsXG4gICAgXCJ0aW1lX29mX2RheVwiLFxuICAgIFwiZGF0ZV9hbmRfdGltZVwiLFxuICAgIFwic3RyaW5nXCIsXG4gICAgXCJib29sXCIsXG4gICAgXCJieXRlXCIsXG4gICAgXCJ3b3JkXCIsXG4gICAgXCJkd29yZFwiLFxuICAgIFwiYXJyYXlcIixcbiAgICBcInBvaW50ZXJcIixcbiAgICBcImx3b3JkXCJcbiAgXSxcbiAgb3BlcmF0b3JzOiBbXG4gICAgXCI9XCIsXG4gICAgXCI+XCIsXG4gICAgXCI8XCIsXG4gICAgXCI6XCIsXG4gICAgXCI6PVwiLFxuICAgIFwiPD1cIixcbiAgICBcIj49XCIsXG4gICAgXCI8PlwiLFxuICAgIFwiJlwiLFxuICAgIFwiK1wiLFxuICAgIFwiLVwiLFxuICAgIFwiKlwiLFxuICAgIFwiKipcIixcbiAgICBcIk1PRFwiLFxuICAgIFwiXlwiLFxuICAgIFwib3JcIixcbiAgICBcImFuZFwiLFxuICAgIFwibm90XCIsXG4gICAgXCJ4b3JcIixcbiAgICBcImFic1wiLFxuICAgIFwiYWNvc1wiLFxuICAgIFwiYXNpblwiLFxuICAgIFwiYXRhblwiLFxuICAgIFwiY29zXCIsXG4gICAgXCJleHBcIixcbiAgICBcImV4cHRcIixcbiAgICBcImxuXCIsXG4gICAgXCJsb2dcIixcbiAgICBcInNpblwiLFxuICAgIFwic3FydFwiLFxuICAgIFwidGFuXCIsXG4gICAgXCJzZWxcIixcbiAgICBcIm1heFwiLFxuICAgIFwibWluXCIsXG4gICAgXCJsaW1pdFwiLFxuICAgIFwibXV4XCIsXG4gICAgXCJzaGxcIixcbiAgICBcInNoclwiLFxuICAgIFwicm9sXCIsXG4gICAgXCJyb3JcIixcbiAgICBcImluZGV4b2ZcIixcbiAgICBcInNpemVvZlwiLFxuICAgIFwiYWRyXCIsXG4gICAgXCJhZHJpbnN0XCIsXG4gICAgXCJiaXRhZHJcIixcbiAgICBcImlzX3ZhbGlkXCIsXG4gICAgXCJyZWZcIixcbiAgICBcInJlZl90b1wiXG4gIF0sXG4gIGJ1aWx0aW5WYXJpYWJsZXM6IFtdLFxuICBidWlsdGluRnVuY3Rpb25zOiBbXG4gICAgXCJzclwiLFxuICAgIFwicnNcIixcbiAgICBcInRwXCIsXG4gICAgXCJ0b25cIixcbiAgICBcInRvZlwiLFxuICAgIFwiZXFcIixcbiAgICBcImdlXCIsXG4gICAgXCJsZVwiLFxuICAgIFwibHRcIixcbiAgICBcIm5lXCIsXG4gICAgXCJyb3VuZFwiLFxuICAgIFwidHJ1bmNcIixcbiAgICBcImN0ZFwiLFxuICAgIFwiXFx1MDQ0MXR1XCIsXG4gICAgXCJjdHVkXCIsXG4gICAgXCJyX3RyaWdcIixcbiAgICBcImZfdHJpZ1wiLFxuICAgIFwibW92ZVwiLFxuICAgIFwiY29uY2F0XCIsXG4gICAgXCJkZWxldGVcIixcbiAgICBcImZpbmRcIixcbiAgICBcImluc2VydFwiLFxuICAgIFwibGVmdFwiLFxuICAgIFwibGVuXCIsXG4gICAgXCJyZXBsYWNlXCIsXG4gICAgXCJyaWdodFwiLFxuICAgIFwicnRjXCJcbiAgXSxcbiAgc3ltYm9sczogL1s9Pjwhfj86JnwrXFwtKlxcL1xcXiVdKy8sXG4gIGVzY2FwZXM6IC9cXFxcKD86W2FiZm5ydHZcXFxcXCInXXx4WzAtOUEtRmEtZl17MSw0fXx1WzAtOUEtRmEtZl17NH18VVswLTlBLUZhLWZdezh9KS8sXG4gIHRva2VuaXplcjoge1xuICAgIHJvb3Q6IFtcbiAgICAgIFsvKFxcLlxcLikvLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvXFxiKDE2I1swLTlBLUZhLWZcXF9dKikrXFxiLywgXCJudW1iZXIuaGV4XCJdLFxuICAgICAgWy9cXGIoMiNbMDFcXF9dKykrXFxiLywgXCJudW1iZXIuYmluYXJ5XCJdLFxuICAgICAgWy9cXGIoOCNbMC05XFxfXSopK1xcYi8sIFwibnVtYmVyLm9jdGFsXCJdLFxuICAgICAgWy9cXGJcXGQqXFwuXFxkKyhbZUVdW1xcLStdP1xcZCspP1xcYi8sIFwibnVtYmVyLmZsb2F0XCJdLFxuICAgICAgWy9cXGIoTD9SRUFMKSNbMC05XFxfXFwuZV0rXFxiLywgXCJudW1iZXIuZmxvYXRcIl0sXG4gICAgICBbL1xcYihCWVRFfCg/OkR8TCk/V09SRHxVPyg/OlN8RHxMKT9JTlQpI1swLTlcXF9dK1xcYi8sIFwibnVtYmVyXCJdLFxuICAgICAgWy9cXGQrLywgXCJudW1iZXJcIl0sXG4gICAgICBbL1xcYihUfERUfFRPRCkjWzAtOTotX3NobXlkXStcXGIvLCBcInRhZ1wiXSxcbiAgICAgIFsvXFwlKEl8UXxNKShYfEJ8V3xEfEwpWzAtOVxcLl0rLywgXCJ0YWdcIl0sXG4gICAgICBbL1xcJShJfFF8TSlbMC05XFwuXSovLCBcInRhZ1wiXSxcbiAgICAgIFsvXFxiW0EtWmEtel17MSw2fSNbMC05XStcXGIvLCBcInRhZ1wiXSxcbiAgICAgIFsvXFxiKFRPX3xDVFVffENURF98Q1RVRF98TVVYX3xTRUxfKVtBX1phLXpdK1xcYi8sIFwicHJlZGVmaW5lZFwiXSxcbiAgICAgIFsvXFxiW0FfWmEtel0rKF9UT18pW0FfWmEtel0rXFxiLywgXCJwcmVkZWZpbmVkXCJdLFxuICAgICAgWy9bO10vLCBcImRlbGltaXRlclwiXSxcbiAgICAgIFsvWy5dLywgeyB0b2tlbjogXCJkZWxpbWl0ZXJcIiwgbmV4dDogXCJAcGFyYW1zXCIgfV0sXG4gICAgICBbXG4gICAgICAgIC9bYS16QS1aX11cXHcqLyxcbiAgICAgICAge1xuICAgICAgICAgIGNhc2VzOiB7XG4gICAgICAgICAgICBcIkBvcGVyYXRvcnNcIjogXCJvcGVyYXRvcnNcIixcbiAgICAgICAgICAgIFwiQGtleXdvcmRzXCI6IFwia2V5d29yZFwiLFxuICAgICAgICAgICAgXCJAdHlwZUtleXdvcmRzXCI6IFwidHlwZVwiLFxuICAgICAgICAgICAgXCJAZGVmaW5lS2V5d29yZHNcIjogXCJ2YXJpYWJsZVwiLFxuICAgICAgICAgICAgXCJAY29uc3RhbnRcIjogXCJjb25zdGFudFwiLFxuICAgICAgICAgICAgXCJAYnVpbHRpblZhcmlhYmxlc1wiOiBcInByZWRlZmluZWRcIixcbiAgICAgICAgICAgIFwiQGJ1aWx0aW5GdW5jdGlvbnNcIjogXCJwcmVkZWZpbmVkXCIsXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwiaWRlbnRpZmllclwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgeyBpbmNsdWRlOiBcIkB3aGl0ZXNwYWNlXCIgfSxcbiAgICAgIFsvW3t9KClcXFtcXF1dLywgXCJAYnJhY2tldHNcIl0sXG4gICAgICBbL1wiKFteXCJcXFxcXXxcXFxcLikqJC8sIFwic3RyaW5nLmludmFsaWRcIl0sXG4gICAgICBbL1wiLywgeyB0b2tlbjogXCJzdHJpbmcucXVvdGVcIiwgYnJhY2tldDogXCJAb3BlblwiLCBuZXh0OiBcIkBzdHJpbmdfZHFcIiB9XSxcbiAgICAgIFsvJy8sIHsgdG9rZW46IFwic3RyaW5nLnF1b3RlXCIsIGJyYWNrZXQ6IFwiQG9wZW5cIiwgbmV4dDogXCJAc3RyaW5nX3NxXCIgfV0sXG4gICAgICBbLydbXlxcXFwnXScvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvKCcpKEBlc2NhcGVzKSgnKS8sIFtcInN0cmluZ1wiLCBcInN0cmluZy5lc2NhcGVcIiwgXCJzdHJpbmdcIl1dLFxuICAgICAgWy8nLywgXCJzdHJpbmcuaW52YWxpZFwiXVxuICAgIF0sXG4gICAgcGFyYW1zOiBbXG4gICAgICBbL1xcYltBLVphLXowLTlfXStcXGIoPz1cXCgpLywgeyB0b2tlbjogXCJpZGVudGlmaWVyXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgWy9cXGJbQS1aYS16MC05X10rXFxiLywgXCJ2YXJpYWJsZS5uYW1lXCIsIFwiQHBvcFwiXVxuICAgIF0sXG4gICAgY29tbWVudDogW1xuICAgICAgWy9bXlxcLypdKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvXFwvXFwqLywgXCJjb21tZW50XCIsIFwiQHB1c2hcIl0sXG4gICAgICBbXCJcXFxcKi9cIiwgXCJjb21tZW50XCIsIFwiQHBvcFwiXSxcbiAgICAgIFsvW1xcLypdLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBjb21tZW50MjogW1xuICAgICAgWy9bXlxcKCpdKy8sIFwiY29tbWVudFwiXSxcbiAgICAgIFsvXFwoXFwqLywgXCJjb21tZW50XCIsIFwiQHB1c2hcIl0sXG4gICAgICBbXCJcXFxcKlxcXFwpXCIsIFwiY29tbWVudFwiLCBcIkBwb3BcIl0sXG4gICAgICBbL1tcXCgqXS8sIFwiY29tbWVudFwiXVxuICAgIF0sXG4gICAgd2hpdGVzcGFjZTogW1xuICAgICAgWy9bIFxcdFxcclxcbl0rLywgXCJ3aGl0ZVwiXSxcbiAgICAgIFsvXFwvXFwvLiokLywgXCJjb21tZW50XCJdLFxuICAgICAgWy9cXC9cXCovLCBcImNvbW1lbnRcIiwgXCJAY29tbWVudFwiXSxcbiAgICAgIFsvXFwoXFwqLywgXCJjb21tZW50XCIsIFwiQGNvbW1lbnQyXCJdXG4gICAgXSxcbiAgICBzdHJpbmdfZHE6IFtcbiAgICAgIFsvW15cXFxcXCJdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvXCIvLCB7IHRva2VuOiBcInN0cmluZy5xdW90ZVwiLCBicmFja2V0OiBcIkBjbG9zZVwiLCBuZXh0OiBcIkBwb3BcIiB9XVxuICAgIF0sXG4gICAgc3RyaW5nX3NxOiBbXG4gICAgICBbL1teXFxcXCddKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXFxcXC4vLCBcInN0cmluZy5lc2NhcGUuaW52YWxpZFwiXSxcbiAgICAgIFsvJy8sIHsgdG9rZW46IFwic3RyaW5nLnF1b3RlXCIsIGJyYWNrZXQ6IFwiQGNsb3NlXCIsIG5leHQ6IFwiQHBvcFwiIH1dXG4gICAgXVxuICB9XG59O1xuZXhwb3J0IHtcbiAgY29uZixcbiAgbGFuZ3VhZ2Vcbn07XG4iXSwibmFtZXMiOlsiY29uZiIsImNvbW1lbnRzIiwibGluZUNvbW1lbnQiLCJibG9ja0NvbW1lbnQiLCJicmFja2V0cyIsImF1dG9DbG9zaW5nUGFpcnMiLCJvcGVuIiwiY2xvc2UiLCJub3RJbiIsInN1cnJvdW5kaW5nUGFpcnMiLCJmb2xkaW5nIiwibWFya2VycyIsInN0YXJ0IiwiUmVnRXhwIiwiZW5kIiwibGFuZ3VhZ2UiLCJkZWZhdWx0VG9rZW4iLCJ0b2tlblBvc3RmaXgiLCJpZ25vcmVDYXNlIiwidG9rZW4iLCJrZXl3b3JkcyIsImNvbnN0YW50IiwiZGVmaW5lS2V5d29yZHMiLCJ0eXBlS2V5d29yZHMiLCJvcGVyYXRvcnMiLCJidWlsdGluVmFyaWFibGVzIiwiYnVpbHRpbkZ1bmN0aW9ucyIsInN5bWJvbHMiLCJlc2NhcGVzIiwidG9rZW5pemVyIiwicm9vdCIsIm5leHQiLCJjYXNlcyIsImluY2x1ZGUiLCJicmFja2V0IiwicGFyYW1zIiwiY29tbWVudCIsImNvbW1lbnQyIiwid2hpdGVzcGFjZSIsInN0cmluZ19kcSIsInN0cmluZ19zcSJdLCJzb3VyY2VSb290IjoiIn0=