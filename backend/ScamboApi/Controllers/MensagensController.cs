using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ScamboApi.Services;

namespace ScamboApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MensagensController : ControllerBase
    {
        private readonly IHubContext<HubMensagens> _hubContext;
        public MensagensController(IHubContext<HubMensagens> hubContext)
        {
            _hubContext = hubContext;
        }
    }
}
