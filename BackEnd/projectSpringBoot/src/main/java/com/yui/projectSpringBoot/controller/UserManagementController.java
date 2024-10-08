package com.yui.projectSpringBoot.controller;

import com.yui.projectSpringBoot.dto.ReqRes;
import com.yui.projectSpringBoot.entity.OurUsers;
import com.yui.projectSpringBoot.helper.Helper;
import com.yui.projectSpringBoot.service.UsersManagementService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class UserManagementController {
    @Autowired
    private UsersManagementService usersManagementService;

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes reg) {
        return ResponseEntity.ok(usersManagementService.register(reg));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req) {
        return ResponseEntity.ok(usersManagementService.login(req));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req) {
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    @GetMapping("/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers() {
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }

    @GetMapping("/get-users/{userId}")
    public ResponseEntity<ReqRes> getUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(usersManagementService.getUserById(userId));
    }

    @PutMapping("/adminuser/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody OurUsers reqres) {
        return ResponseEntity.ok(usersManagementService.updateUser(userId,reqres));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }

    @PostMapping("/admin/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        if (Helper.checkExcelFormat(file)) {
            try {
                usersManagementService.save(file);
                return ResponseEntity.ok(Map.of("Message", "File is uploaded and data is saved to db"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save data");
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload an Excel file");
    }

    @GetMapping("/admin/export")
    public void exportUsersToExcel(HttpServletResponse response) throws IOException {
        ReqRes reqRes = usersManagementService.getAllUsers();
        List<OurUsers> users = reqRes.getOurUsersList();
        if (users != null && !users.isEmpty()) {
            byte[] excelBytes = Helper.exportUsersToExcel(users);

            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
            response.setContentLength(excelBytes.length);

            try (var outputStream = response.getOutputStream()) {
                outputStream.write(excelBytes);
            }
        } else {
            response.setContentType("text/plain");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("No users found to export.");
        }
    }


    @PostMapping("/admin/lock/{userId}")
    public ResponseEntity<?> lockUser(@PathVariable Integer userId) {
        usersManagementService.lockUserAccount(userId);
        return ResponseEntity.ok("User locked");
    }

    @PostMapping("/admin/unlock/{userId}")
    public ResponseEntity<?> unlockUser(@PathVariable Integer userId) {
        usersManagementService.unlockUserAccount(userId);
        return ResponseEntity.ok("User unlocked");
    }

}
