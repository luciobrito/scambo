namespace ScamboApi.Models
{
    public class usuarios
    {
        public int idUsuario { get; set; }
        public string nome { get; set; }
        public string email { get; set; }
        public string senha { get; set; }
        public List<string> fotoPerfilUrl { get; set; }
        public double latitude { get; set; }
        public double longitude { get; set; }
        public string tipoDeUsuario { get; set; }
    }
}