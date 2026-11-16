using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScamboApi.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public Anuncio Anuncio {get;set;}
        public Usuario Remetente {get;set;}
        [JsonIgnore]
        public List<Mensagem> Mensagens {get;set;}
        [NotMapped]
        public Mensagem UltimaMensagem {get;set;}
        public bool UsuarioFazParteDoChat(Usuario usuario)
        {
            if(Remetente.Equals(usuario) || Anuncio.Anunciante.Equals(usuario))
                return true;
            else
                return false;
        }
    }
}