using System;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ScamboApi.Enums;
using ScamboApi.Interfaces;
namespace ScamboApi.Services;

public interface IServicoArmazenamento
{
    string EnviarArquivo(IFormFile arquivo);
    string EnviarArquivo(IFormFile arquivo, TipoArquivo tipoArquivo);
    Response BaixarArquivo(string caminhoArquivo);
    Response<BlobDownloadStreamingResult> RetornarArquivo(string caminhoArquivo);
}
