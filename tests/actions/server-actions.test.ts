// import { expect, test, vi } from "vitest";
// import { server } from "../../src/actions";
// import { actions } from "astro:actions";


// test("Test login action and execute it", async () => {
//     const formData = new FormData();
//     formData.append("name", "admin");
//     formData.append("password", "123456789");
//     formData.append("remember", "true");
//     const { data, error } = await actions.login(formData);
    
//     if ( error ) {
//         expect(error.message.length).toBeGreaterThan(0);
//     }

//     expect(data).toBeDefined();
//     expect(data?.nickname).toBe("admin");
//     expect(data?.loginTime).toBeDefined();
// });

// test("Test register action and fail it", async () => {
//     const formData = new FormData();
//     formData.append("name", "newuser");
//     formData.append("email", "X6TtU@example.com");
//     formData.append("password", "123456789");
//     const { data, error } = await actions.registerUser(formData);

//     expect(data).toBeUndefined();
//     expect(error).toBeDefined();
//     expect(error?.message.length).toBeGreaterThan(0);
// });

// test("Test logout action", async () => {
//     const { data, error } = await actions.logout(null);

//     expect(data).toBeDefined();
//     expect(data?.message).toBe("Usuario deslogueado con éxito");
//     expect(error).toBeUndefined();
// });

