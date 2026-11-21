using System;
using System.Security.Claims;

namespace ScamboApi.Extensions;

public static class AuthExtension
{
    public static int AuthUserId(this ClaimsPrincipal claims)
    {
        if(claims == null) throw new ArgumentNullException(nameof(claims));
        return Int32.Parse(claims.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    }
}
