# APP - GymPass style app

API para usuário fazer check-in em academias. 

## Requisitos funcionais
O que é possível que o usuário faça na aplicação.

- [ ] Deve ser possível se cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [ ] Deve ser possível o usuário obter seu histórico de check-ins;
- [ ] Deve ser possível o usuário buscar academias próximas;
- [ ] Deve ser possível o usuário buscar academias pelo nome;
- [ ] Deve ser possível o usuário realizar check-in em uma academia; 
- [ ] Deve ser possível validar o check-in de um usuário;
- [ ] Deve ser possível cadastrar uma academia;

## Regras de negócio
Determina condições que serão aplicadas para cada requisito funcional.SEMPRE é associada à um requisito funcional

- [ ] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [ ] O usuário não pode fazer 2 check-ins no mesmo dia;
- [ ] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [ ] O check-in só pode ser validado até 20 minutos após criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por

## Requisitos não funcionais
Requisitos que não partem do cliente, são requisitos mais técnicos. ex: Qual banco de dados será utilizado.

- [ ] A senha do usuário precisa estar criptografada;
- [ ] Os dados da aplicação precisam estar persistido em um banco PostgreSQL;
- [ ] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);

## Instalação
```sh
# Subindo o banco de dados com docker
docker compose up -d
```