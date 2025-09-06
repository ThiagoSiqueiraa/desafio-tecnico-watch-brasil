import axios from "axios";

test("Deve criar um projeto com sucesso", async () => {
    //Given
    const input = {
        name: 'Novo projeto'
    }

    //When
    const response = await axios.post('http://localhost:3000/projects', input)

    //Then
    expect(response.status).toBe(200)
    expect(response.data.id).toBeGreaterThan(0)
    expect(response.data.name).toBe(input.name)

});