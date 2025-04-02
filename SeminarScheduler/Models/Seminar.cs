using System;
using System.ComponentModel.DataAnnotations;

namespace SeminarScheduler.Models
{
    public class Seminar
    {
        // Primary key for the seminar
        public int Id { get; set; }

        // Basic seminar information
        [Required]
        [StringLength(10)]
        public string CourseCode { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        // Scheduling information
        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Required]
        [StringLength(50)]
        public string Location { get; set; }

        // Foreign keys for relationships
        public int DepartmentId { get; set; }
        public int? FacultyId { get; set; } // Optional, can be null if not assigned yet

        // Additional properties
        public int MaxEnrollment { get; set; }
        public int CurrentEnrollment { get; set; }
        public bool IsCore { get; set; }
        public bool IsFirstYear { get; set; }

        // Status tracking
        public bool HasConflict { get; set; }
        public string ConflictDetails { get; set; }
        public DateTime LastUpdated { get; set; }

        // Helper properties for display
        public string ColorCode => DepartmentId switch
        {
            1 => "#4e73df", // Computer Science - blue
            2 => "#1cc88a", // Mathematics - green
            3 => "#f6c23e", // English - yellow
            4 => "#36b9cc", // History - cyan
            _ => "#858796"  // Default - gray
        };

        public string BorderColor => HasConflict ? "#e74a3b" : ColorCode; // Red border for conflicts
    }
}