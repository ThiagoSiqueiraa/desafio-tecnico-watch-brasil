import axios from "axios";

test("Deve criar um projeto com sucesso", async () => {
  //Given
  const input = {
    name: `Projeto-${Math.random().toString(36).substring(2, 10)}`,
  };

  //When
  const responseCreateProject = await axios.post(
    "http://localhost:3000/projects",
    input
  );
  const outputCreateProject = responseCreateProject.data;
  //Then
  expect(responseCreateProject.status).toBe(200);
  expect(outputCreateProject.id).toBeDefined();

  console.log(outputCreateProject);
  const responseGetAccount = await axios.get(
    `http://localhost:3000/projects/${outputCreateProject.id}`
  );
  const outputGetProject = responseGetAccount.data;
  expect(outputGetProject.name).toBe(input.name);
});

test("Deve retornar todos os projetos do usuário", async () => {
  //Given
  const userId = 1;
  //When
  const response = await axios.get(
    `http://localhost:3000/projects?userId=${userId}`
  );
  const projects = response.data;
  //Then
  expect(response.status).toBe(200);
  expect(Array.isArray(projects)).toBe(true);
  projects.forEach((project: any) => {
    expect(project).toHaveProperty("id");
    expect(project).toHaveProperty("name");
  });
});

test("Deve deletar um projeto com sucesso", async () => {
  //Given
  const input = {
    name: `Projeto-${Math.random().toString(36).substring(2, 10)}`,
  };
  const responseCreateProject = await axios.post(
    "http://localhost:3000/projects",
    input
  );
  const outputCreateProject = responseCreateProject.data;
  expect(responseCreateProject.status).toBe(200);
  expect(outputCreateProject.id).toBeDefined();
  const projectId = outputCreateProject.id;

  //When
  const responseDelete = await axios.delete(
    `http://localhost:3000/projects/${projectId}`
  );
  //Then
  expect(responseDelete.status).toBe(204);

  //Verifica se o projeto foi realmente deletado
  try {
    await axios.get(`http://localhost:3000/projects/${projectId}`);
  } catch (error: any) {
    expect(error.response.status).toBe(404);
    expect(error.response.data.message).toBe("Projeto não encontrado");
  }
});

test("Não deve criar um projeto se o nome for vazio", async () => {
  //Given
  const input = {
    name: "",
  };
  //When
  try {
    await axios.post("http://localhost:3000/projects", input);
  } catch (error: any) {
    //Then
    expect(error.response.status).toBe(400);
    expect(error.response.data.message).toBe("Nome do projeto é obrigatório");
  }
});

test("Deve criar uma tarefa a um projeto", async () => {
  //Given
  const projectInput = {
    name: `Projeto-${Math.random().toString(36).substring(2, 10)}`,
  };
  const responseCreateProject = await axios.post(
    "http://localhost:3000/projects",
    projectInput
  );
  const outputCreateProject = responseCreateProject.data;
  expect(responseCreateProject.status).toBe(200);
  expect(outputCreateProject.id).toBeDefined();
  const projectId = outputCreateProject.id;

  const taskInput = {
    title: "Minha tarefa",
    projectId: projectId,
    status: "pending",
    priority: "low",
    dueDate: "2024-12-31",
  };

  //When
  const responseCreateTask = await axios.post(
    "http://localhost:3000/tasks",
    taskInput
  );
  const outputCreateTask = responseCreateTask.data;

  //Then
  expect(responseCreateTask.status).toBe(200);
  expect(outputCreateTask.id).toBeDefined();
  expect(outputCreateTask.title).toBe(taskInput.title);
  expect(outputCreateTask.projectId).toBe(taskInput.projectId);
  expect(outputCreateTask.status).toBe(taskInput.status);
  expect(outputCreateTask.priority).toBe(taskInput.priority);
  expect(outputCreateTask.dueDate).toBe(taskInput.dueDate);
});

test("Deve criar um usuário com sucesso", async () => {
  //Given
  const input = {
    name: `user${Math.random().toString(36).substring(2, 10)}`,
    email: `user${Math.random().toString(36).substring(2, 10)}@example.com`,
    password: "password123",
  };

  //When
  const response = await axios.post("http://localhost:3000/users", input);
  const output = response.data;
  //Then
  expect(response.status).toBe(200);
  expect(output.id).toBeDefined();
  expect(output.name).toBe(input.name);
  expect(output.email).toBe(input.email);
  expect(output).not.toHaveProperty("password");
});

test("Deve logar um usuário com sucesso", async () => {
  //Given
  const userInput = {
    name: `user${Math.random().toString(36).substring(2, 10)}`,
    email: `user${Math.random().toString(36).substring(2, 10)}@example.com`,
    password: "password123",
  };
  const responseCreateUser = await axios.post(
    "http://localhost:3000/users",
    userInput
  );
  const outputCreateUser = responseCreateUser.data;
  expect(responseCreateUser.status).toBe(200);
  expect(outputCreateUser.id).toBeDefined();

  const loginInput = {
    email: userInput.email,
    password: userInput.password,
  };

  //When
  const responseLogin = await axios.post(
    "http://localhost:3000/login",
    loginInput
  );
  const outputLogin = responseLogin.data;
  //Then
  expect(responseLogin.status).toBe(200);
  expect(outputLogin.token).toBeDefined();
});


