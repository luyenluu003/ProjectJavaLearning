package com.yui.projectSpringBoot.service;

import com.yui.projectSpringBoot.dto.ReqRes;
import com.yui.projectSpringBoot.entity.OurUsers;
import com.yui.projectSpringBoot.helper.Helper;
import com.yui.projectSpringBoot.reponsitory.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersManagementService {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void save(MultipartFile file) {
        try {
            List<OurUsers> newUsers = Helper.convertExceltoListOfOurUsers(file.getInputStream(),passwordEncoder);
            List<OurUsers> existingUsers = usersRepo.findAll();
            existingUsers.addAll(newUsers);
            usersRepo.saveAll(existingUsers);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ReqRes register(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();
        try{
            OurUsers ourUser = new OurUsers();
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setName(registrationRequest.getName());
            ourUser.setRole(registrationRequest.getRole());
            ourUser.setAddress(registrationRequest.getAddress());
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            OurUsers ourUsersResult = usersRepo.save(ourUser);
            if (ourUsersResult.getId() >0) {
                resp.setOurUsers(ourUsersResult);
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
            }
        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public ReqRes login(ReqRes loginRequest) {
        ReqRes resp = new ReqRes();
        System.out.println("Login Request: " + loginRequest);
        try{
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            resp.setStatusCode(200);
            resp.setToken(jwt);
            resp.setRole(user.getRole());
            resp.setRefreshToken(refreshToken);
            resp.setExpirationTime("24Hrs");
            resp.setMessage("Successfully logged in");
        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }

    public ReqRes refreshToken(ReqRes refreshToken) {
        ReqRes resp = new ReqRes();
        try{
            String ourEmail = jwtUtils.extractUsername(refreshToken.getToken());
            OurUsers ourUser = usersRepo.findByEmail(ourEmail).orElseThrow();
            if(jwtUtils.isTokenValid(refreshToken.getToken(),ourUser)){
                var jwt = jwtUtils.generateToken(ourUser);
                resp.setStatusCode(200);
                resp.setToken(jwt);
                resp.setRefreshToken(refreshToken.getToken());
                resp.setExpirationTime("24Hrs");
                resp.setMessage("Successfully refreshed Token");
            }
            resp.setStatusCode(200);
            return resp;
        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
            return resp;
        }
    }

    public ReqRes getAllUsers(){
        ReqRes reqRes = new ReqRes();
        try{
            List<OurUsers> result = usersRepo.findAll();
            if(!result.isEmpty()){
                reqRes.setOurUsersList(result);
                System.out.println("Fetched users: " + result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successfully retrieved all users");
            }else{
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred:"+e.getMessage());
            return reqRes;
        }
    }

    public ReqRes getUserById(Integer id){
        ReqRes reqRes = new ReqRes();
        try{
            OurUsers usersById = usersRepo.findById(id).orElseThrow(()->new RuntimeException("User Not Found"));
            reqRes.setOurUsers(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id "+id+" found successfully");
        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred:"+e.getMessage());
        }
        return reqRes;
    }

    public ReqRes deleteUser(Integer userId){
        ReqRes reqRes = new ReqRes();
        try{
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if(userOptional.isPresent()){
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User Deleted Successfully");
            }else{
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found with id "+userId);
            }
        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleteing user:"+e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, OurUsers updateUser){
        ReqRes reqRes = new ReqRes();
        try{
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if(userOptional.isPresent()){
                OurUsers existingUser = userOptional.get();
                existingUser.setEmail(updateUser.getEmail());
                existingUser.setName(updateUser.getName());
                existingUser.setRole(updateUser.getRole());
                existingUser.setAddress(updateUser.getAddress());

//                Check is password is present in the request
                if(updateUser.getPassword()!=null && !updateUser.getPassword().isEmpty()){
                    existingUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
                }

                OurUsers savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User Updated Successfully");
            }else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found with id "+userId);
            }
        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user:"+e.getMessage());
        }
        return reqRes;
    }

    public ReqRes getMyInfo(String email){
        ReqRes reqRes = new ReqRes();
        try{
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if(userOptional.isPresent()){
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("User found successfully");
            }else{
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found with email "+email);
            }
        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info:"+e.getMessage());
        }
        return reqRes;
    }
}
