using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using ScamboApi.DTOs;

namespace ScamboApi.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        [Required]
        public string Email { get; set; }
        [JsonIgnore]
        public string Senha { get; set; }
        //public List<string> FotoPerfilUrl { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string TipoUsuario { get; set; }
        [JsonIgnore]
        public List<Anuncio> Anuncios {get;set;}
        public Usuario()
        {
            
        }
        public Usuario(UsuarioRegistroDTO usuarioRegistroDTO)
        {
            Nome = usuarioRegistroDTO.Nome;
            Senha = usuarioRegistroDTO.Senha;
            Email = usuarioRegistroDTO.Email;
            TipoUsuario = "comum";
        }
        public bool Equals(Usuario usuario)=> usuario.Id == Id;
    }
}