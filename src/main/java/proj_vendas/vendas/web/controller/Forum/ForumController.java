package proj_vendas.vendas.web.controller.Forum;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Comentario;
import proj_vendas.vendas.model.Duvida;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Duvidas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/f")
public class ForumController {

	@Autowired
	private Duvidas duvidas;

	@Autowired
	private Usuarios usuarios;

	@GetMapping("/forum")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		List<Duvida> todasDuvidas = user.getDuvida();
		ModelAndView mv = new ModelAndView("forum");
		
		for (int i = 1; i < 6; i++) {
			mv.addObject("op" + i, 0);
		}

		for (int i = 0; i < todasDuvidas.size(); i++) {
			mv.addObject("op" + todasDuvidas.get(i).getCodigo(), 1);
			mv.addObject("pergunta" + todasDuvidas.get(i).getCodigo(), todasDuvidas.get(i).getDuvida());
			mv.addObject("id" + todasDuvidas.get(i).getCodigo(), todasDuvidas.get(i).getId());
		}
		return mv;
	}

	@RequestMapping("/forum/todasPerguntas")
	@ResponseBody
	public List<Duvida> todasPerguntas() {
		return duvidas.findAll();
	}

	@RequestMapping("/forum/criar")
	@ResponseBody
	public ResponseEntity<Duvida> criar(@RequestBody Duvida duvida) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		List<Duvida> minhasPerguntas = user.getDuvida();
		novaDuvida(-1, duvida, user);

		for (int i = 0; i < minhasPerguntas.size(); i++) {
			if (minhasPerguntas.get(i).getCodigo() == duvida.getCodigo()) {
				Duvida dvSalva = duvidas.findByCodigo(duvida.getCodigo());
				novaDuvida(dvSalva.getId(), duvida, user);
				duvidas.save(duvida);
				return ResponseEntity.ok(duvida);
			}
		}

		// salvar no usuario
		minhasPerguntas.add(duvida);
		user.setDuvida(minhasPerguntas);
		usuarios.save(user);

		return ResponseEntity.ok(duvida);
	}

	@RequestMapping("/forum/minhasPerguntas")
	@ResponseBody
	public List<Duvida> minhasPerguntas() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return user.getDuvida();
	}

	@RequestMapping("/forum/comentar/{id}")
	@ResponseBody
	public Comentario comentar(@PathVariable long id, @RequestBody String mensagem) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		SimpleDateFormat format = new SimpleDateFormat("kk:mm:ss dd/MM/yyyy");

		Duvida duvida = duvidas.findById(id).get();
		List<Comentario> comentarios = duvida.getComentario();
		Comentario comentario = new Comentario();

		comentario.setResponsavel(user.getNome());
		comentario.setDescricao(mensagem);
		comentario.setData(format.format(new Date()));
		comentarios.add(comentario);

		duvida.setComentario(comentarios);
		duvidas.save(duvida);

		return comentario;
	}

	@RequestMapping("/forum/excluir/{id}")
	@ResponseBody
	public ResponseEntity<?> excluir(@PathVariable long id) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		List<Duvida> todasDuvidas = user.getDuvida();

		for (int i = 0; i < todasDuvidas.size(); i++) {
			if (todasDuvidas.get(i).getId() == id) {
				todasDuvidas.remove(i);
				user.setDuvida(todasDuvidas);
				usuarios.save(user);
				duvidas.deleteById(id);
				return ResponseEntity.ok(200);
			}
		}
		return ResponseEntity.noContent().build();
	}

	private Duvida novaDuvida(long id, Duvida duvida, Usuario user) {
		// validade
		SimpleDateFormat format = new SimpleDateFormat("kk:mm:ss dd/MM/yyyy");
		SimpleDateFormat data = new SimpleDateFormat("yyyy-");
		SimpleDateFormat mesString = new SimpleDateFormat("MM");
		SimpleDateFormat dia = new SimpleDateFormat("-dd");

		if (id != -1)
			duvida.setId(id);
		duvida.setNome(user.getNome());
		duvida.setConcluido(false);
		duvida.setData(format.format(new Date()));

		int mesInt = Integer.parseInt(mesString.format(new Date()));

		// permite 1 mes
		mesInt += 1;

		if (mesInt < 10)
			duvida.setValidade(data.format(new Date()) + "0" + mesInt + dia.format(new Date()));
		else
			duvida.setValidade(data.format(new Date()) + mesInt + dia.format(new Date()));

		return duvida;
	}
}
