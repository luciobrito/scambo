using System;
using System.Reflection.Metadata;
using Azure;
using Azure.Storage.Blobs;

namespace ScamboApi.Services;

public class ServicoArmazenamento : IServicoArmazenamento
{
    private BlobContainerClient _blobContainerClient;
    public ServicoArmazenamento(BlobContainerClient blobContainerClient)
    {
        _blobContainerClient = blobContainerClient;
        _blobContainerClient.CreateIfNotExists();
    }
    public void EnviarArquivo(FileStream arquivo)
    {
        BlobClient blob = _blobContainerClient.GetBlobClient(arquivo.Name);
        blob.Upload(arquivo);
    }
    public Response BaixarArquivo(string caminhoArquivo)
    {
        return new BlobClient(new Uri(caminhoArquivo)).DownloadTo("");
    }
}
