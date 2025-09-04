using Bridge.API.Controllers;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace Bridge.UnitTest
{
    [TestClass]
    public class SharedControllerTests
    {

        private readonly Mock<ISharedSync> _mockSharedSync;
        private readonly SharedController _sharedController;
        private readonly Mock<ILogger<SharedController>> _logger = new Mock<ILogger<SharedController>>();

        public SharedControllerTests()
        {
            _mockSharedSync = new Mock<ISharedSync>();
            _sharedController = new SharedController(_mockSharedSync.Object, _logger.Object);
        }

        #region GetSkills

        [TestMethod]
        public void GetSkills_When_TableHasData_Then_ReturnOkResult()
        {
            _mockSharedSync.Setup(x => x.GetSkills()).Returns(Task.FromResult(GetSkillList()));
            var res = _sharedController.GetSkills().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetSkills_When_TableHasNoData_ReturnsNotFoundResult()
        {
            List<Skills>? skillvalues =  null ;
            _mockSharedSync.Setup(e => e.GetSkills()).ReturnsAsync(skillvalues);
            var controller = new SharedController(_mockSharedSync.Object, _logger.Object);
            var result = await controller.GetSkills();
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        private List<Skills> GetSkillList()
        {
            var skillsList = new List<Skills>
            {
                new Skills { SkillName = "Angular" },
                new Skills { SkillName = ".Net" }
            };
            return skillsList;
        }

        #endregion

        #region GetRoles

        [TestMethod]
        public void GetRoles_When_TableHasData_Then_ReturnOkResult()
        {
            _mockSharedSync.Setup(x => x.GetRoles()).Returns(Task.FromResult(GetRoleList()));
            var res = _sharedController.GetRoles().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetRoles_When_TableHasNoData_ReturnsNoContentResult()
        {
            List<Roles>? roles = null;
            _mockSharedSync.Setup(e => e.GetRoles()).ReturnsAsync(roles);
            var controller = new SharedController(_mockSharedSync.Object, _logger.Object);
            var result = await controller.GetRoles();
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        private List<Roles> GetRoleList()
        {
            var rolesList = new List<Roles>
            {
                new Roles {RoleName = "Software Engineer" },
                new Roles {RoleName = "Senior Software Engineer" },
                new Roles {RoleName = "Qa Manual" }
            };
            return rolesList;
        }

        #endregion
    }
}
