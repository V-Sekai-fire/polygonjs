import lodash_uniq from 'lodash/uniq';
import lodash_compact from 'lodash/compact';
import lodash_flatten from 'lodash/flatten';
import lodash_capitalize from 'lodash/capitalize';
import lodash_snakeCase from 'lodash/snakeCase';
import lodash_upperFirst from 'lodash/upperFirst';
import lodash_camelCase from 'lodash/camelCase';
import { CoreType } from './Type';
import { ArrayUtils } from './ArrayUtils';

const ATTRIB_NAMES_SEPARATOR = /[, ]/; //[',', ' ']

// const LETTERS = 'abcdefghijklmnopqrstuvwxyz'
// const LETTERS_UPPERCASE = LETTERS.toUpperCase()
// const NUMBERS = '0123645789'
// const ALL = LETTERS + LETTERS_UPPERCASE + NUMBERS

const TAIL_DIGIT_MATCH_REGEXP = /\d+$/;
const LEADING_ZEROS_MATCH_REGEXP = /^0+/;
// const DIGIT_PREDEDED_BY_UNDERSCOPE = /_\d$/
const INDICES_LIST_SEPARATOR = /,| /;
const ZERO = '0';
const SPACE = ' ';

// https://stackoverflow.com/questions/41856126/regexp-optional-dot-in-a-decimal-number
const NUM_REGEXP = /^-?\d+\.?\d*$/;
enum BooleanString {
	TRUE = 'true',
	FALSE = 'false',
}

export class CoreString {
	// static has_tail_digits(word: string): boolean {
	// 	const match = word.match(TAIL_DIGIT_MATCH_REGEXP)
	// 	return (match != null)
	// }
	static is_boolean(word: string): boolean {
		return word == BooleanString.TRUE || word == BooleanString.FALSE;
	}
	static to_boolean(word: string): boolean {
		return word == BooleanString.TRUE;
	}
	static is_number(word: string): boolean {
		return NUM_REGEXP.test(word);
	}

	static tail_digits(word: string): number {
		const match = word.match(TAIL_DIGIT_MATCH_REGEXP);
		if (match) {
			return parseInt(match[0]);
		} else {
			return 0;
		}
	}

	static increment(word: string): string {
		const match = word.match(TAIL_DIGIT_MATCH_REGEXP);
		if (match) {
			let numbers_as_str = match[0];
			let zeros_prefix: string = '';
			const leading_zeros_match = numbers_as_str.match(LEADING_ZEROS_MATCH_REGEXP);
			if (leading_zeros_match) {
				zeros_prefix = leading_zeros_match[0];
			}

			const digits = parseInt(numbers_as_str);
			if (digits == 0) {
				if (zeros_prefix.length > 0) {
					if (zeros_prefix[zeros_prefix.length - 1] == ZERO) {
						zeros_prefix = zeros_prefix.slice(0, -1);
					}
				}
			}

			const prefix = word.substring(0, word.length - match[0].length);
			return `${prefix}${zeros_prefix}${digits + 1}`;
		} else {
			return `${word}1`;
		}
	}

	static pluralize(word: string): string {
		const last_char = word[word.length - 1];
		if (last_char !== 's') {
			return `${word}s`;
		} else {
			return word;
		}
	}

	static camel_case(word: string): string {
		return lodash_camelCase(word);
	}
	static upper_first(word: string): string {
		return lodash_upperFirst(word);
	}
	static snake_case(word: string): string {
		return lodash_snakeCase(word);
	}
	static titleize(word: string): string {
		return lodash_capitalize(word.replace(/_/g, ' '));
	}

	static type_to_class_name(word: string): string {
		return this.upper_first(lodash_camelCase(word));
	}
	// static class_name_to_type(word): string {
	// 	// if(this.has_tail_digits(word)){
	// 	// 	const tail_digits = `${this.tail_digits(word)}`
	// 	// 	const head = word.substr(0, word.length-tail_digits.length)
	// 	// 	const head_snake_case = this.snake_case(head)
	// 	// 	console.log(word, tail_digits, head, head_snake_case)
	// 	// 	return `${head_snake_case}${tail_digits}`;
	// 	// } else {
	// 	// 	return this.snake_case(word)
	// 	// }
	// 	const snake_case = this.snake_case(word)
	// 	const match = snake_case.match(DIGIT_PREDEDED_BY_UNDERSCOPE)
	// 	console.log("-----", snake_case, match)
	// 	return snake_case
	// }
	// static class_name_to_human(word): string {
	// 	const human_name = this.class_name_to_type(word).replace(/\s/, ' ');
	// 	return human_name.replace(/_/g, " ");
	// }

	static timestamp_to_seconds(word: string): number {
		return Date.parse(word) / 1000;
	}
	static seconds_to_timestamp(seconds: number): string {
		const d = new Date();
		d.setTime(seconds * 1000);
		return d.toISOString().substr(11, 8);
	}

	static precision(val: number, decimals: number = 2): string {
		decimals = Math.max(decimals, 0);
		const elements = `${val}`.split('.');

		if (decimals <= 0) {
			return elements[0];
		}

		let frac = elements[1];
		if (frac !== undefined) {
			if (frac.length > decimals) {
				frac = frac.substring(0, decimals);
			}

			frac = frac.padEnd(decimals, '0');
			return `${elements[0]}.${frac}`;
		} else {
			const string_to_pad = `${val}.`;
			const pad = string_to_pad.length + decimals;
			return string_to_pad.padEnd(pad, '0');
		}
	}

	static ensure_float(num: number): string {
		// const integer = Math.floor(num)
		// const delta = num - integer
		// if(delta)
		const num_as_string = `${num}`;
		const dot_pos = num_as_string.indexOf('.');
		if (dot_pos >= 0) {
			return num_as_string;
		} else {
			return `${num_as_string}.0`;
		}
	}

	// https://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript#32402438
	static match_mask(word: string, mask: string) {
		if (mask === '*') {
			return true;
		}
		const elements = mask.split(SPACE);
		if (elements.length > 1) {
			for (let element of elements) {
				const match = this.match_mask(word, element);
				if (match) {
					return true;
				}
			}
			return false;
		}

		// "."  => Find a single character, except newline or line terminator
		// ".*" => Matches any string that contains zero or more characters
		mask = mask.split('*').join('.*');

		// "^"  => Matches any string with the following at the beginning of it
		// "$"  => Matches any string with that in front at the end of it
		mask = `^${mask}$`;

		// Create a regular expression object for matching string
		const regex = new RegExp(mask);

		// Returns true if it finds a match, otherwise it returns false
		return regex.test(word);
	}
	static matches_one_mask(word: string, masks: string[]): boolean {
		let matches_one_mask = false;
		for (let mask of masks) {
			if (CoreString.match_mask(word, mask)) {
				matches_one_mask = true;
			}
		}
		return matches_one_mask;
	}

	static attrib_names(word: string): string[] {
		const elements = word.split(ATTRIB_NAMES_SEPARATOR);
		const trimed_elements = lodash_compact(
			elements.map((e) => {
				return e.trim();
			})
		);
		const uniq = lodash_uniq(trimed_elements);
		return uniq;
	}
	static to_id(val: string): number {
		if (val == null) {
			return 0;
		}

		const elements = val.split('').reverse();
		let id = 0;
		let exp = 0;
		elements.forEach((element, i) => {
			let index = element.charCodeAt(0);

			if (index >= 0) {
				exp = i % 10;
				id += index * 10 ** exp;
				id = id % Number.MAX_SAFE_INTEGER;
			}
		});
		return id;
	}

	static indices(indices_string: string): number[] {
		const elements = indices_string.split(INDICES_LIST_SEPARATOR);
		if (elements.length > 1) {
			return lodash_uniq(lodash_flatten(elements.map((element) => this.indices(element)))).sort((a, b) => a - b);
		} else {
			const element = elements[0];
			if (element) {
				const range_separator = '-';
				if (element.indexOf(range_separator) > 0) {
					const range_elements = element.split(range_separator);
					return ArrayUtils.range(parseInt(range_elements[0]), parseInt(range_elements[1]) + 1);
				} else {
					const parsed = parseInt(element);
					if (CoreType.isNumber(parsed)) {
						return [parsed];
					} else {
						return [];
					}
				}
			} else {
				return [];
			}
		}
	}

	static escape_line_breaks(word: string): string {
		return word.replace(/(\r\n|\n|\r)/gm, '\\n');
	}
}
