import re
from flask import Blueprint, render_template, request
import enchant

ple = Blueprint("pig-latin-encoder", __name__, template_folder="templates")

PUNCTUATION = {"(", ")", ".", ",", "!", "?", ":", ";", "'", '"'}
VOWEL_END = "way"
CONSONANT_END = "ay"


def create_prefix_suffix(word):
    prefix = word
    suffix = ""
    for i, letter in reversed(list(enumerate(word))):
        if letter not in PUNCTUATION:
            prefix = word[: i + 1]
            suffix = word[i + 1 :]
            break
    return prefix, suffix


def trim_apostrophes(prefix, suffix):
    if prefix.find("'") > -1:
        j = prefix.find("'")
        suffix = prefix[j:] + suffix
        prefix = prefix[:j]
    return prefix, suffix


def check_digit(prefix, results):
    error = False
    if prefix.isdigit():
        results["error"] = True
        results["digits"].add(prefix)

    return results, error


def decode_ay(prefix, casing, d):
    candidate = prefix.removesuffix("ay")
    k = 0
    while not d.check(candidate) and k < len(candidate):
        candidate = candidate[-1] + candidate[:-1]
        if casing["upper"]:
            candidate = candidate.upper()
        if casing["title"]:
            candidate = candidate.title()
        k += 1

    return candidate, k


@ple.route("/pig-latin-encoder", methods=["GET", "POST"])
def pig_latin_encoder():
    if request.method == "POST":
        results = {}
        results["digits"] = set()
        vowels = {"a", "e", "i", "o", "u", "y"}
        # Take the string and split it on ' '
        message = re.findall(r"\S+|\n", request.form["message"])
        for i, word in enumerate(message):
            # for each word, first check to see if the end is a puncuation
            # if it is, count how many letters are puncuation and ignore them
            prefix, suffix = create_prefix_suffix(word)

            prefix, suffix = trim_apostrophes(prefix, suffix)

            results, error = check_digit(prefix, results)
            if error:
                continue

            if not prefix.isalpha():
                continue

            # If a word starts with a vowel, just add "way" to the end
            if prefix[0].lower() in vowels:
                prefix += VOWEL_END
                message[i] = prefix + suffix
            # If a word starts with a constanant, find the number of constanatns
            # that a word starts with and move them to the end of the word and append with "ay"
            # rejoin the string and return it
            else:
                k = 0
                while prefix[k].lower() not in vowels:
                    k += 1

                titlecase = prefix.istitle()

                if titlecase:
                    new_word = prefix[k:].title() + prefix[:k].lower() + CONSONANT_END
                else:
                    new_word = prefix[k:] + prefix[:k] + CONSONANT_END

                message[i] = new_word + suffix

        results["encoded"] = " ".join(message)

        return render_template("bbospp/piglatinencoder.html.jinja", results=results)

    return render_template("bbospp/piglatinencoder.html.jinja")


@ple.route("/pig-latin-decoder", methods=["GET", "POST"])
def pig_latin_decoder():
    if request.method == "POST":
        # get the message and split it using regex
        results = {}
        message = re.findall(r"\S+|\n", request.form["message"])
        results["digits"] = set()
        results["invalid"] = set()
        results["variations"] = set()
        results["digits_error"] = False
        results["invalid_error"] = False
        d = enchant.Dict("en_US")
        # review each word
        for i, word in enumerate(message):
            if word == "\n":
                continue

            # Get prefix and suffix from punctuation
            prefix, suffix = create_prefix_suffix(word)

            prefix, suffix = trim_apostrophes(prefix, suffix)

            # if it is a number, bail and add it to a set
            if prefix.isdigit():
                results["digits_error"] = True
                results["digits"].add(prefix)
                continue

            # if it doesn't contain "ay" or "way" at the end, bail and add it to a set
            if not prefix.endswith(("ay", "way")):
                results["invalid_error"] = True
                results["invalid"].add(word)
                continue

            casing = {"upper": prefix.isupper(), "title": prefix.istitle()}

            if prefix.endswith("way"):
                candidate = prefix.removesuffix("way")
                if casing["upper"]:
                    candidate = candidate.upper()
                if casing["title"]:
                    candidate = candidate.title()

                if d.check(candidate):
                    message[i] = candidate + suffix
                else:
                    candidate, k = decode_ay(prefix, casing, d)

                    if k == len(candidate):
                        results["invalid"].add(word)
                    else:
                        message[i] = candidate + suffix
            else:
                candidate, k = decode_ay(prefix, casing, d)

                if k == len(candidate):
                    results["invalid"].add(word)
                else:
                    message[i] = candidate + suffix

        results["decoded"] = " ".join(message)

        return render_template("bbospp/piglatindecoder.html.jinja", results=results)

    return render_template("bbospp/piglatindecoder.html.jinja")
