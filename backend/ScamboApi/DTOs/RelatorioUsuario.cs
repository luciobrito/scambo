using System;
using ScamboApi.Models;

namespace ScamboApi.DTOs;

public record RelatorioUsuario(int Id, string Nome, string Email, DateTime CriadoEm, DateTime? AtualizadoEm, List<Anuncio> AnunciosFinalizados, List<Anuncio> AnunciosAtivos, int QuantidadeAnuncios);
