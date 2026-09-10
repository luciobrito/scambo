using System;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
namespace ScamboApi.Services;

public interface IServicoArmazenamento
{
    void EnviarArquivo(IFormFile arquivo);
    
    Response BaixarArquivo(string caminhoArquivo);
    Response<BlobDownloadStreamingResult> RetornarArquivo(string caminhoArquivo);
}
