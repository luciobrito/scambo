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
    }
}