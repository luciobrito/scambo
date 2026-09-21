namespace ScamboApi.Models
{
    public class Anuncio
    {
        public int idAnuncio { get; set; }
        public string titulo { get; set; }
        public string descricao { get; set; }
        public List<string> fotoUrlAnuncio { get; set; }
        public string estadoConservacao { get; set; }
        public string modalidade { get; set; }
        public DateTime dataPublicacao { get; set; }
        public string status { get; set; }
    }
}