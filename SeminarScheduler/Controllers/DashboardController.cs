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
            // In a real application, you would fetch data from services/repositories
            // For mockup purposes, we'll just return the view
            return View();
        }

        // Calendar view - displays schedule in calendar format
        public IActionResult Calendar()
        {
            // In a real implementation, you would:
            // 1. Fetch seminar and course data from database
            // 2. Pass the data to the view via a view model
            return View();
        }

        // Courses view - lists available seminars
        public IActionResult Courses()
        {
            return View("~/Views/Home/Courses.cshtml");

        }


        // Faculty view - lists faculty members
        public IActionResult Faculty()
        {
            return View("~/Views/Home/Faculty.cshtml");
        }
    }
}