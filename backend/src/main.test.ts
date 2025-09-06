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
