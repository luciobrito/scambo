using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using ScamboApi.Interfaces;

namespace ScamboApi.Models
{
    public class Chat : ITimestampedEntity
    {
        public int Id { get; set; }
        public Anuncio Anuncio {get;set;}
        public Usuario Remetente {get;set;}
        [JsonIgnore]
        public List<Mensagem> Mensagens {get;set;}
        [NotMapped]
        public Mensagem UltimaMensagem {get;set;}
        [NotMapped]
        public int NaoLidas {get;set;}
        public DateTime CriadoEm { get; set; }
        public DateTime? AtualizadoEm { get; set; }

        public bool UsuarioFazParteDoChat(Usuario usuario)
        {
            if(Remetente.Equals(usuario) || Anuncio.Anunciante.Equals(usuario))
                return true;
            else
                return false;
        }
    }
}