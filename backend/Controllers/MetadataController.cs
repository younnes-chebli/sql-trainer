using Microsoft.AspNetCore.Mvc;
using prid.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace prid.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class MetadataController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public MetadataController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet("tables/{databaseName}")]
    public string[] GetTables(string databaseName) {
        string[] facebookTables = { "destinataires", "estami", "message", "personne" };
        string[] fournisseursTables = { "j", "p", "s", "spj" };

        if (databaseName == "facebook") {
            return facebookTables;
        } else if (databaseName == "fournisseurs") {
            return fournisseursTables;
        }
        return Array.Empty<string>();
    }

    [HttpGet("columns/{databaseName}")]
    public string[] GetColumns(string databaseName) {
        string[] facebookColumns = { "ID_Message", "Destinataire", "SSN1", "SSN2", "Contenu", "Date_Expedition", "Expediteur", "SSN", "Nom", "Sexe", "Age" };
        string[] fournisseursColumns = { "ID_J", "JNAME", "CITY", "ID_P", "PNAME", "COLOR", "WEIGHT", "CITY", "ID_S", "SNAME", "STATUS", "QTY", "DATE_DERNIERE_LIVRAISON" };

        if (databaseName == "facebook") {
            return facebookColumns;
        } else if (databaseName == "fournisseurs") {
            return fournisseursColumns;
        }
        return Array.Empty<string>();
    }
}
