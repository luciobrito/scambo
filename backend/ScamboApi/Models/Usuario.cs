namespace ScamboApi.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        //public List<string> FotoPerfilUrl { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string TipoUsuario { get; set; }
    }
}