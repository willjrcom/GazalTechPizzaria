package proj_vendas.vendas.web.controller.exception;

import java.rmi.ServerException;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javassist.NotFoundException;

@ControllerAdvice
public class ExceptionController {

	@ExceptionHandler(NotFoundException.class)
	public ModelAndView notFound(NotFoundException user) {
		ModelAndView mv = new ModelAndView("error");
		mv.addObject("status", 404);
		mv.addObject("error", "Página não encontrada!");
		mv.addObject("message", user.getMessage());
		return mv;
	}
	
	@ExceptionHandler(ServerException.class)
	public ModelAndView serverError(ServerException user) {
		ModelAndView mv = new ModelAndView("error");
		mv.addObject("status", 500);
		mv.addObject("error", "Operação não pode ser realizada!");
		mv.addObject("message", user.getMessage());
		return mv;
	}
}
