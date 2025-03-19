using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SeminarScheduler.Areas.Identity.Pages.Account
{
    public class LoginModel : PageModel
    {
        public void OnGet()
        {
        }

        [BindProperty]
        public string? ReturnUrl { get; set; } = string.Empty;

        public IActionResult OnPost()
        {
            // Add your login logic here
            if (ModelState.IsValid)
            {
                // Perform login operations
                return RedirectToPage("./Index");
            }

            // If login fails, return the page with validation errors
            return Page();
        }
    }
}
