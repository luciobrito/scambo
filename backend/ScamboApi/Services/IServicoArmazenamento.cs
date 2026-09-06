using System;
using Azure;
using Azure.Storage.Blobs;
namespace ScamboApi.Services;

public interface IServicoArmazenamento
{
    void EnviarArquivo(IFormFile arquivo);
    
    Response BaixarArquivo(string caminhoArquivo);
    
}
