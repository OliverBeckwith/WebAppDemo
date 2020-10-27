
export async function checkAdmin()
{
    const response = await fetch("api/admin/logincheck", {
        method: "GET",
        credentials: "include"
    });
    if (response.ok) {
        return true;
    }
    return false;
}