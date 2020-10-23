interface ITemplateVariables {
  [key: string]: string;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
