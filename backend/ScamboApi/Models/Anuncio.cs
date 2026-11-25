using ScamboApi.DTOs;

namespace ScamboApi.Models
{
    public class Anuncio
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        //public List<string> FotoUrlAnuncio { get; set; }
        public string EstadoConservacao { get; set; }
        public string Modalidade { get; set; }
        public DateTime DataPublicacao { get; set; }
        public string Status { get; set; }
        public Usuario Anunciante {get;set;}
        public int AnuncianteId {get;set;}
        public Anuncio()
        {
            
        }
        public Anuncio(NovoAnuncioDTO novoAnuncioDTO)
        {
            Titulo = novoAnuncioDTO.Titulo;
            Descricao = novoAnuncioDTO.Descricao;
            EstadoConservacao = novoAnuncioDTO.EstadoConservacao;
            Modalidade = novoAnuncioDTO.Modalidade;
            DataPublicacao = DateTime.Now;
            Status = novoAnuncioDTO.Status;
        }
    }
}