using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Reflection;
namespace Bridge.API
{
    /// <summary>
    /// Extension class defined for Swagger Class
    /// </summary>
    [ExcludeFromCodeCoverage]
    public static class SwaggerExtension
    {
        /// <summary>
        /// Add Swagger support Query API service
        /// </summary>
        /// <param name="services"></param>
        public static void AddSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                //c.AddSecurityDefinition("Bearer_Token", new OpenApiSecurityScheme
                //{
                //    Scheme = "Bearer",
                //    BearerFormat = "JWT",
                //    In = ParameterLocation.Header,
                //    Name = "Bearer_Token",
                //    Description = "Bearer Authentication with JWT Token",
                //    Type = SecuritySchemeType.Http
                //});
                c.AddSecurityDefinition("Bearer_Token", new OpenApiSecurityScheme
                {
                    Scheme = "Bearer_Token",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Name = "Bearer_Token",
                    Type = SecuritySchemeType.ApiKey,
                    Description = "Abbout Bearer_Token",
                }
                );

                c.AddSecurityDefinition("UserName", new OpenApiSecurityScheme
                {
                    Scheme = "UserName",  
                    In = ParameterLocation.Header,
                    Name = "UserName",
                    Type = SecuritySchemeType.ApiKey,
                    Description = "Abbout UserName", 
                }
                );
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                 {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Id = "Bearer_Token",
                            Type = ReferenceType.SecurityScheme
                        }
                    },
                    new List<string>()
                }
                    ,{
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Id = "UserName",
                            Type = ReferenceType.SecurityScheme,                            

                        }
                    },
                    new List<string>()
                }
                });
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Bridge Service",
                    Description = "Bridge Service",
                    Contact = new OpenApiContact() { Name = "Emids" }
                });
            });
            // services.AddSwaggerGenNewtonsoftSupport();
            services.AddSwaggerGen();
        }

        /// <summary>
        /// Uses Custom Swagger
        /// </summary>
        /// <param name="app"></param>
        public static void UseCustomSwagger(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Bridge Service API");
            });
        }
    }
}
