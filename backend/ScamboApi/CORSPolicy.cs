public static class CORSPolicy
{
    public static void AddCorsPolicy(this IServiceCollection service)
    {
        service.AddCors(options => 
        options.AddDefaultPolicy(policy => 
            policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials()
            )
        );
    }
}