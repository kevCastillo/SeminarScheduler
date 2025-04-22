using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeminarScheduler.Views.Home;
using System.Threading.Tasks;

namespace SeminarScheduler.Controllers
{
    [Authorize] // This attribute ensures only authenticated users can access
    public class DashboardController : Controller
    {
        // Main dashboard view - displays overview statistics and recent activity
        public IActionResult Index()
        {
            return RedirectToAction("Index", "Home");
        }

        // Calendar view
        public IActionResult Calendar()
        {
            return RedirectToAction("Calendar", "Home");
        }

        // Courses view - lists available seminars
        public IActionResult Courses()
        {
            return RedirectToAction("Courses", "Home");
        }

        // Faculty view - lists faculty members
        public IActionResult Faculty()
        {
            return RedirectToAction("Faculty", "Home");
        }
    }
}