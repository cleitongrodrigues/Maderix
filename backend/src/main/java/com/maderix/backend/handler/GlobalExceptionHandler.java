package com.maderix.backend.handler;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.maderix.backend.exception.CredenciaisInvalidasException;
import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.exception.TokenInvalidoException;

@ControllerAdvice
public class GlobalExceptionHandler {

    private Map<String, Object> buildErrorResponse(HttpStatus status, String message){
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("status", status.value());
        errorDetails.put("erro", status.getReasonPhrase());
        errorDetails.put("message", message);

        return errorDetails;
    }

    //Retorna erro 401 nao autorizado || Lida com erros de autoizacao e permissao
    @ExceptionHandler(CredenciaisInvalidasException.class)
    public ResponseEntity<Object> handleCredenciaisInvalidas(CredenciaisInvalidasException e){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body(buildErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage()));
    }

    //Retorna 404 not found | Lida com erro de recursos nao encontrado
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handlerResourceNotFound(ResourceNotFoundException e){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body(buildErrorResponse(HttpStatus.NOT_FOUND, e.getMessage()));
    }

    //Retorna 400 bad request | Lida com erro de TokenInvalido ou regras de negócio 
    @ExceptionHandler(TokenInvalidoException.class)
    public ResponseEntity<Object> handlerTokenInvalido(TokenInvalidoException e){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body(buildErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationException(MethodArgumentNotValidException e){
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error ->{
            errors.put(error.getField(), error.getDefaultMessage());
        });

        Map<String, Object> response = buildErrorResponse(HttpStatus.BAD_REQUEST
                                                         ,"Erro de Validação com os Dados de Entrada");
        response.put("detalhes", errors);
                                              
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
