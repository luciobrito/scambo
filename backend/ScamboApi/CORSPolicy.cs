public static class CORSPolicy
{
    public static void AddCorsPolicy(this IServiceCollection service)
    {
        service.AddCors(options => 
        options.AddDefaultPolicy(policy => 
            // Se o Vite subir em outra porta (5174, 5175...), as chamadas do front são bloqueadas.
            policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials()
            )
        );
    }
}