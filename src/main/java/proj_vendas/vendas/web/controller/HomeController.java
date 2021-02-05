package proj_vendas.vendas.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/")
public class HomeController {
	
	@GetMapping({"/index"})
	public ModelAndView tela() {
		return new ModelAndView("index");
	}
	
	@GetMapping("/login-erro")
	public String erro(ModelMap model, HttpServletRequest resp) {
		HttpSession session = resp.getSession();
		String lastException = String.valueOf(session.getAttribute("SPRING_SECURITY_LAST_EXCEPTION"));	
		if(lastException.contains(SessionAuthenticationException.class.getName())){
			model.addAttribute("titulo", "Acesso recusado!");
			model.addAttribute("texto", "Você já está conectado em outro dispositivo!");
			return "index";
		}

		model.addAttribute("titulo", "Credenciais inválidas!");
		model.addAttribute("texto", "Login e/ou senha incorretos, tente novamente!");
		return "index";
	}
}
