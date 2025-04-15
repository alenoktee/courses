using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupTeacher> GroupTeachers { get; set; }
        public DbSet<GroupStudent> GroupStudents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Настройка индексов
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.PhoneNumber)
                .IsUnique();

            modelBuilder.Entity<Group>()
                .HasIndex(g => g.Code)
                .IsUnique();

            // Настройка связей
            modelBuilder.Entity<Teacher>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Group>()
                .HasOne(g => g.Creator)
                .WithMany()
                .HasForeignKey(g => g.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GroupTeacher>()
                .HasOne(gt => gt.Group)
                .WithMany()
                .HasForeignKey(gt => gt.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GroupTeacher>()
                .HasOne(gt => gt.Teacher)
                .WithMany()
                .HasForeignKey(gt => gt.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GroupStudent>()
                .HasOne(gs => gs.Group)
                .WithMany()
                .HasForeignKey(gs => gs.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GroupStudent>()
                .HasOne(gs => gs.Student)
                .WithMany()
                .HasForeignKey(gs => gs.StudentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
