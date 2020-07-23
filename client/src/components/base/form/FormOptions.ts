export type InputType = {
    type: 'text' | 'email' | 'password' | 'image';
    eid: string;
    name: string; // POST时的name
    placeholder: string;
    multiline?: boolean;
}

export type RuleType = {
    patterns?: RegExp[]; // 正则表达式数组，‘or’的关系，只要有一个【通过】，就算整个Rule就通过
    stop?: boolean; // 如果这条Rule不通过，stop=true表示不继续进行后面的Rule的匹配
    pass: boolean;
    tip: string; // Rule【不通过】时显示的提示信息
}

export type InputGroupOptions = {
    required: boolean;
    preIconClzz: string; // 例如 fa fa-user
    input: InputType;
    rules: RuleType[]; // 规则数组，‘and’的关系，只有所有rule都通过才算通过
}

export type Submit = {
    verb: string;
}

export type FormOptions = {
    groups: InputGroupOptions[];
    submit: Submit;
    postUrl: string;
}
