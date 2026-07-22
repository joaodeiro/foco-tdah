# Catálogo de mensagens ao usuário

Toasts, erros e textos exibidos pelo gestaovet. **Atualizar sempre que adicionar ou mudar uma mensagem.**

## Login (`/login`)

| Situação | Tipo | Mensagem |
| --- | --- | --- |
| Falha no login | erro | Não foi possível entrar. Confira o e-mail e a senha. |
| Falha ao criar conta | erro | Não foi possível criar a conta. Tente novamente. |
| Conta criada, confirmação pendente | sucesso | Conta criada! Confira seu e-mail para confirmar o cadastro. |

## Pacientes

| Situação | Tipo | Mensagem |
| --- | --- | --- |
| Falha ao carregar lista | erro | Não foi possível carregar os pacientes. |
| Tutor sem nome no cadastro | erro | Informe o nome do tutor. |
| Falha ao salvar tutor | erro | Não foi possível salvar o tutor. |
| Falha ao salvar animal | erro | Não foi possível salvar o animal. |
| Cadastro concluído | sucesso | Paciente cadastrado! |
| Paciente inexistente | erro | Paciente não encontrado. |
| Edição salva | sucesso | Dados atualizados! |
| Falha na edição | erro | Não foi possível salvar as alterações. |

## Consultas

| Situação | Tipo | Mensagem |
| --- | --- | --- |
| Falha ao salvar | erro | Não foi possível salvar a consulta. |
| Consulta criada | sucesso | Consulta registrada! |
| Consulta editada | sucesso | Consulta atualizada! |
| Consulta inexistente | erro | Consulta não encontrada. |

## Receitas

| Situação | Tipo | Mensagem |
| --- | --- | --- |
| Nenhum medicamento informado | erro | Adicione pelo menos um medicamento. |
| Falha ao salvar | erro | Não foi possível salvar a receita. |
| Receita criada | sucesso | Receita salva! Abrindo para impressão. |

## Documentos

| Situação | Tipo | Mensagem |
| --- | --- | --- |
| Conteúdo vazio | erro | Escreva o conteúdo do documento. |
| Falha ao salvar | erro | Não foi possível salvar o documento. |
| Documento criado | sucesso | Documento salvo! Abrindo para impressão. |

## Orçamentos

| Situação | Tipo | Mensagem |
| --- | --- | --- |
| Falha ao carregar lista | erro | Não foi possível carregar os orçamentos. |
| Nenhum item informado | erro | Adicione pelo menos um item ao orçamento. |
| Falha ao salvar | erro | Não foi possível salvar o orçamento. |
| Orçamento criado | sucesso | Orçamento salvo! Abrindo para impressão. |

## Serviços e preços

| Situação | Tipo | Mensagem |
| --- | --- | --- |
| Falha ao carregar | erro | Não foi possível carregar os serviços. |
| Falha ao adicionar | erro | Não foi possível adicionar o serviço. |
| Serviço adicionado | sucesso | Serviço adicionado! |
| Falha nos exemplos | erro | Não foi possível adicionar os exemplos. |
| Exemplos criados | sucesso | Lista criada! Agora é só ajustar os valores. |
| Falha ao editar | erro | Não foi possível salvar a alteração. |
| Serviço editado | sucesso | Serviço atualizado! |

## Configurações

| Situação | Tipo | Mensagem |
| --- | --- | --- |
| Falha ao salvar perfil | erro | Não foi possível salvar o perfil. |
| Perfil salvo | sucesso | Perfil salvo! |

## Genéricas (exclusão)

| Situação | Tipo | Mensagem |
| --- | --- | --- |
| Confirmação de exclusão | confirm | Excluir {item}? Essa ação não tem volta. |
| Falha ao excluir | erro | Não foi possível excluir. Tente novamente. |
| Exclusão concluída | sucesso | Excluído. |

## Avisos em tela (não são toasts)

- Impressão sem perfil preenchido: "Dica: preencha seu nome e CRMV em Configurações para eles saírem no cabeçalho."
- Orçamento sem tabela de preços: "Dica: cadastre seus serviços em Preços para adicioná-los aqui com um clique, sem digitar valores toda vez."
