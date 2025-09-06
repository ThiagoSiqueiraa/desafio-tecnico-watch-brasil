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
    `http://localhost:3000/project/${outputCreateProject.id}`
  );
  const outputGetProject = responseGetAccount.data;
  expect(outputGetProject.name).toBe(input.name);
});


test("Deve retornar todos os projetos do usuário", async () => {
    //Given
    const userId = 1;
    //When
    const response = await axios.get(`http://localhost:3000/projects?userId=${userId}`);
    const projects = response.data;
    //Then
    expect(response.status).toBe(200);
    expect(Array.isArray(projects)).toBe(true);
    projects.forEach((project: any) => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('name');
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
    const responseDelete = await axios.delete(`http://localhost:3000/projects/${projectId}`);
    //Then
    expect(responseDelete.status).toBe(204);
    
    //Verifica se o projeto foi realmente deletado
    try {
        await axios.get(`http://localhost:3000/project/${projectId}`);
    } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.message).toBe("Projeto não encontrado");
    }
});