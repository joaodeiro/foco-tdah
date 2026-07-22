export type Especie = "cao" | "gato";
export type Sexo = "macho" | "femea" | "";

export type Perfil = {
  user_id: string;
  nome: string;
  crmv: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade_uf: string;
};

export type Tutor = {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  endereco: string;
  observacoes: string;
  created_at: string;
};

export type Animal = {
  id: string;
  tutor_id: string;
  nome: string;
  especie: Especie;
  raca: string;
  sexo: Sexo;
  nascimento: string | null;
  idade_texto: string;
  peso_kg: number | null;
  pelagem: string;
  castrado: boolean | null;
  observacoes: string;
  created_at: string;
  tutor?: Tutor;
};

export type Consulta = {
  id: string;
  animal_id: string;
  data: string;
  tipo: "consulta" | "retorno";
  peso_kg: number | null;
  anamnese: string;
  exame_fisico: string;
  diagnostico: string;
  tratamento: string;
  observacoes: string;
};

export type ReceitaItem = {
  medicamento: string;
  quantidade: string;
  posologia: string;
};

export type Receita = {
  id: string;
  animal_id: string;
  data: string;
  tipo: "simples" | "controlada";
  itens: ReceitaItem[];
  observacoes: string;
};

export type TipoDocumento = "encaminhamento" | "atestado" | "outro";

export type Documento = {
  id: string;
  animal_id: string;
  data: string;
  tipo: TipoDocumento;
  titulo: string;
  conteudo: string;
};

export type Servico = {
  id: string;
  nome: string;
  valor: number;
};

export type OrcamentoItem = {
  descricao: string;
  qtd: number;
  valor: number;
};

export type Orcamento = {
  id: string;
  tutor_id: string | null;
  animal_id: string | null;
  data: string;
  itens: OrcamentoItem[];
  desconto: number;
  observacoes: string;
  animal?: (Pick<Animal, "id" | "nome" | "especie"> & { tutor?: Pick<Tutor, "id" | "nome"> | null }) | null;
  tutor?: Pick<Tutor, "id" | "nome"> | null;
};
