using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SeminarScheduler.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace SeminarScheduler.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Authorize] // This attribute ensures only authenticated users can access
        public IActionResult Dashboard()
        {
            return View();
        }

        [Authorize]
        public IActionResult Calendar()
        {
            return View();
        }

        [Authorize]
        public IActionResult Courses()
        {
            return View();
        }

        [Authorize]
        public IActionResult Faculty()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        public class CoursesController : Controller
        {
            public IActionResult CoursesLoginIn()
            {
                return View();
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}