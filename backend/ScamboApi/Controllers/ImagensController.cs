using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScamboApi.Services;

namespace ScamboApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagensController : ControllerBase
    {
        private readonly IServicoArmazenamento _servicoArmazenamento;
        public ImagensController(IServicoArmazenamento servicoArmazenamento)
        {
            _servicoArmazenamento = servicoArmazenamento;
        }
        [HttpGet("{caminhoImagem}")]
        public IActionResult GetImagens(string caminhoImagem)
        {
            var resultado = _servicoArmazenamento.RetornarArquivo(caminhoImagem);
            string contentType = resultado.Value.Details.ContentType;
            return File(resultado.Value.Content, contentType);
        }
    }
}
