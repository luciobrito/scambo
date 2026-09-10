using System;
using System.Reflection.Metadata;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.StaticFiles;

namespace ScamboApi.Services;

public class ServicoArmazenamento : IServicoArmazenamento
{
    private BlobContainerClient _blobContainerClient;
    public ServicoArmazenamento(BlobContainerClient blobContainerClient)
    {
        _blobContainerClient = blobContainerClient;
        _blobContainerClient.CreateIfNotExists();
    }
    public void EnviarArquivo(IFormFile arquivo)
    {
        ValidarArquivo(arquivo);
        var headerCustomizada = HeaderCustomizada(arquivo);
        using(var memoryStream = new MemoryStream())
        {
            arquivo.CopyTo(memoryStream);
            memoryStream.Position = 0;
            BlobClient blob = _blobContainerClient.GetBlobClient(GerarNomeUnicoArquivo(arquivo));
            blob.Upload(memoryStream);
            blob.SetHttpHeaders(headerCustomizada);
        }
    }
    private void ValidarArquivo(IFormFile arquivo)
    {
        //Escrever regras de validação do arquivo (ex: extensões permitidas, tamanho máximo etc.)
        if(arquivo.Length == 0)
        {
            throw new Exception("Arquivo vazio");
        }
    }
    private String GerarNomeUnicoArquivo(IFormFile arquivo) => $"{Guid.NewGuid()}{Path.GetExtension(arquivo.FileName)}";
    public Response BaixarArquivo(string caminhoArquivo)
    {
        return new BlobClient(new Uri(caminhoArquivo)).DownloadTo("");
    }
    public Response<BlobDownloadStreamingResult> RetornarArquivo(string caminhoArquivo)
    {
        var blobClient = _blobContainerClient.GetBlobClient(caminhoArquivo);
        
        if(!blobClient.Exists()) throw new FileNotFoundException();
        var downloadInfo = blobClient.DownloadStreaming();
        return downloadInfo;
    }
    private string ConsultarHeaderArquivo(IFormFile arquivo)
    {
        var provider = new FileExtensionContentTypeProvider();
        if(provider.TryGetContentType(arquivo.FileName, out string? contentType))
        {
            return contentType;
        }
        else return "application/octet-stream";
    }
    private BlobHttpHeaders HeaderCustomizada(IFormFile arquivo)
    {
        return new BlobHttpHeaders
        {
            ContentType = ConsultarHeaderArquivo(arquivo)
        };
    }
}
