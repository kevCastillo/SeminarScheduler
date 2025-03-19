using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SeminarScheduler.Areas.Identity.Pages.Account
{
    public class RegisterModel : PageModel
    {
        public void OnGet()
        {
        }

        [BindProperty]
        public string? ReturnUrl { get; set; } = string.Empty;

        public IActionResult OnPost()
        {
            // Add your registration logic here
            if (ModelState.IsValid)
            {
                // Perform registration operations
                return RedirectToPage("./Index");
            }

            // If registration fails, return the page with validation errors
            return Page();
        }
    }
}
